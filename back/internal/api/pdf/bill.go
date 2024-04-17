package pdf

import (
	"back/config"
	"back/internal/api/billCustomization"
	"back/internal/api/company"
	"back/internal/api/customers"
	"back/internal/lib/models"
	"fmt"
	"log"
	"os"
	"time"

	_ "image/jpeg"
	_ "image/png"

	"github.com/jung-kurt/gofpdf"
	"github.com/jung-kurt/gofpdf/contrib/httpimg"
)

func generateBillPDF(bill models.Bill) *os.File {
	var TITLE = BILL_TITLE
	var FOLDER = BILLS_FOLDER
	var tva = 0.0
	var hasVat = bill.Tva != nil && *bill.Tva > 0
	if hasVat {
		tva = float64(*bill.Tva)
	}

	company := company.DAO.FindOneById(bill.CompanyID)
	customization := billCustomization.DAO.FindFirstOrInitByTenant(bill.CompanyID)
	customer := models.Customer{}
	if bill.CustomerID != nil {
		customer = customers.DAO.FindOneByIdAndTenant(*bill.CustomerID, bill.CompanyID)
	}
	mainColor, err := parseHexColor(customization.MainColor)
	if err != nil {
		mainColor = whiteRGB
	}
	pdf := gofpdf.New("P", "mm", "A4", "")

	pageSize := pdf.GetPageSizeStr("A4")
	pdf.AddPage()
	pdf.SetMargins(marginL, marginL, marginL)
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.SetFont(fontFamily, "", fontSize)
	pdf.SetAutoPageBreak(false, 0)
	pdf.SetFooterFunc(func() {
		pdf.SetY(pageSize.Ht - float64(marginB))
		pdf.SetX(marginL)
		pdf.SetFont(fontFamily, "I", 5)
		pdf.MultiCell(pageSize.Wd-marginL*2, 5, tr(customization.Footer), "", "L", false)
	})

	var cols = colsWithoutVat
	if hasVat {
		cols = colsWithVat
	}

	// Put the logo
	if company.Logo != nil {
    imgdata, err := os.Open(config.Get().UploadDir + fmt.Sprintf("/%s/logo.png", company.ID))
		if err == nil {
			opt := gofpdf.ImageOptions{
				ImageType: "png",
			}
			_ = pdf.RegisterImageOptionsReader(*company.Logo, opt, imgdata)
			imgdata.Close()
			pdf.ImageOptions(*company.Logo, marginL, marginL, 30, 30, false, opt, 0, "")
		} else {
			httpimg.Register(pdf, *company.Logo, "png")
			opt := gofpdf.ImageOptions{
				ImageType: "png",
			}
			pdf.ImageOptions(*company.Logo, marginL, marginL, 30, 30, false, opt, 0, "")
		}
	}
	pdf.SetX(-100 - marginL)

	date := time.Now()
	_, lineHt := pdf.GetFontSize()

	// Put creation date
	pdf.CellFormat(100, 5, tr(DATE_TITLE+" : "+date.Format("02/01/2006")), "0", 1, "R", false, 0, "")
	pdf.Ln(2)

	pdf.SetX(-50 - marginL)
	pdf.SetFont(fontFamily, "B", 14)
	pdf.SetLineWidth(1)
	pdf.SetFillColor(int(mainColor.R), int(mainColor.G), int(mainColor.B))

	// Write DEVIS for bills
	pdf.CellFormat(50, 10, tr(TITLE), "1", 1, "C", true, 0, "")
	pdf.SetFont(fontFamily, "", fontSize)

	pdf.SetY(35)
	pdf.SetX(marginL)
	companyStr := getCompagnyStr(company, customization.DisplayCompanyEmail, customization.DisplayCompanyPhoneNumber)

	pdf.SetY(pdf.GetY() + lineHt)
	y := pdf.GetY()

	// Put company information
	pdf.MultiCell(cols[0], lineHt+lineMargin, tr(companyStr), "0", "L", false)
	afterCompanyY := pdf.GetY()
	pdf.SetY(y)
	pdf.SetX(pageSize.Wd - marginL - sumArrayWithoutDesignation(cols))

	// Put customer information
	if customer.Name != "" {
		customerStr := fmt.Sprintf("%s\n%s\n%s, %s", customer.Name, customer.Address, customer.PostalCode, customer.City)
		if customization.DisplayCustomerEmail {
			customerStr += fmt.Sprintf("\n%s", customer.Email)
		}
		if customization.DisplayCustomerPhoneNumber {
			customerStr += fmt.Sprintf("\n%s", customer.PhoneNumber)
		}
		pdf.MultiCell(sumArrayWithoutDesignation(cols), lineHt+lineMargin, tr(customerStr), "0", "R", false)
	}
	afterCustomerY := pdf.GetY()

	if afterCompanyY > afterCustomerY {
		y = afterCompanyY
	} else {
		y = afterCustomerY
	}

	pdf.SetFont(fontFamily, "B", fontSize)
	pdf.SetY(y + cellMargin)
	pdf.MultiCell(pageSize.Wd-marginL*2, lineHt, tr(REFERENCE_TITLE+" : "+bill.Name), "", "R", false)
	pdf.SetY(pdf.GetY() + lineHt)
	pdf.MultiCell(pageSize.Wd-marginL*2, lineHt, tr(OBJECT_TITLE+" : "+bill.Title), "", "L", false)
	pdf.SetY(pdf.GetY() + lineHt)

	// Add headers
	addHeaders(pdf, mainColor, cols)

	reportTotal := 0.0

	for i, line := range bill.Lines {
		pdf.SetFont(fontFamily, "", fontSize)
		pdf.SetX(marginL)

		lineColor := whiteRGB
		if i%2 == 1 {
			lineColor = grayRGB
		}
		pdf.SetFillColor(int(lineColor.R), int(lineColor.G), int(lineColor.B))

		quantity := fmt.Sprintf("%.2f", line.Quantity)
		price := fmt.Sprintf("%.2f€", line.Price)
		priceTTC := fmt.Sprintf("%.2f€", roundTwoDecimals(getTTCPrice(line.Price, tva/100)))
		linePrice := roundTwoDecimals(getLinePrice(line.Price, line.Quantity, tva/100))
		subtotal := fmt.Sprintf("%.2f€", linePrice)

		lines := pdf.SplitLines([]byte(line.Name), cols[0]-cellMarginLarge)
		descriptionLines := pdf.SplitLines([]byte(line.Description), cols[0]-cellMarginLarge-marginL)
		height := float64(len(lines)+len(descriptionLines))*lineHt + lineMargin*float64(len(lines)+len(descriptionLines)) + cellMargin*2

		// The height of the row more the height of total and tva
		// Go to new page and write HEADERS again
		if pdf.GetY()+height+(lineHt+lineMargin*4)*2 > pageSize.Ht-float64(marginB)-cellMarginLarge {
			pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())
			addTotal(pdf, reportTotal, cols)
			pdf.AddPage()
			addHeaders(pdf, mainColor, cols)
		}

		pdf.SetFont(fontFamily, "B", fontSize)
		pdf.SetDrawColor(pdf.GetFillColor())
		// Draw the background color of th eline
		pdf.Rect(pdf.GetX(), pdf.GetY(), float64(pageSize.Wd-marginL*2), float64(height), "F")
		pdf.SetDrawColor(int(blackRGB.R), int(blackRGB.G), int(blackRGB.B))

		currentY := pdf.GetY()
		pdf.SetXY(marginL+cellMargin, currentY+cellMargin)

		// When no price write OFFERT
		if line.Price == 0 {
			price = FREE_STR
			subtotal = FREE_STR
			priceTTC = FREE_STR
		}

		// If no price, quantity and no description write the line as a title so reset all strings and change font
		pdf.SetFont(fontFamily, "", fontSize)
		if line.Price == 0 && line.Quantity == 0 && line.Description == "" {
			pdf.SetFont(fontFamily, "B", fontSize)
			pdf.SetCellMargin(lineMargin)
			quantity = ""
			price = ""
			priceTTC = ""
			subtotal = ""
		}

		// Write in designation column
		for _, line := range lines {
			pdf.SetX(marginL + cellMargin)
			pdf.MultiCell(cols[0]-cellMargin, lineHt+lineMargin, tr(string(line)), "", "", false)
		}

		// In case it was a title we reset the font
		pdf.SetFont(fontFamily, "", fontSize)

		// Write the description
		for _, descriptionLine := range descriptionLines {
			pdf.SetX(marginL + cellMargin*2)
			pdf.MultiCell(cols[0]-cellMargin*2, lineHt+lineMargin, tr(string(descriptionLine)), "", "", false)
		}

		// Place the cursor on the same line and after designation column
		pdf.SetXY(marginL+cols[0], currentY)

		// Now it will put quantity, ht(if quota has tva) and ttc
		if !hasVat {
			pdf.CellFormat(cols[1], height, quantity, "", 0, "C", true, 0, "")
			pdf.CellFormat(cols[2], height, tr(price), "", 0, "C", true, 0, "")
			pdf.CellFormat(cols[3], height, tr(subtotal), "", 0, "C", true, 0, "")
		} else {
			pdf.CellFormat(cols[1], height, quantity, "", 0, "C", true, 0, "")
			pdf.CellFormat(cols[3], height, tr(price), "", 0, "C", true, 0, "")
			pdf.CellFormat(cols[2], height, tr(priceTTC), "", 0, "C", true, 0, "")
			pdf.CellFormat(cols[4], height, tr(subtotal), "", 0, "C", true, 0, "")
		}

		// Cell borders
		pdf.Line(marginL, currentY, marginL, currentY+float64(height))
		pdf.Line(marginL+cols[0], currentY, marginL+cols[0], currentY+float64(height))
		pdf.Line(marginL+cols[0]+cols[1], currentY, marginL+cols[0]+cols[1], currentY+float64(height))
		pdf.Line(marginL+cols[0]+cols[1]+cols[2], currentY, marginL+cols[0]+cols[1]+cols[2], currentY+float64(height))
		pdf.Line(marginL+cols[0]+cols[1]+cols[2]+cols[3], currentY, marginL+cols[0]+cols[1]+cols[2]+cols[3], currentY+float64(height))

		// It defer when there are VAT or not
		if hasVat {
			pdf.Line(marginL+cols[0]+cols[1]+cols[2]+cols[3]+cols[4], currentY, marginL+cols[0]+cols[1]+cols[2]+cols[3]+cols[4], currentY+float64(height))
		}

		pdf.SetXY(marginL, currentY+height)

		if linePrice > 0 {
			reportTotal += linePrice
		}
	}

	// End the table witht he bottom line
	pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())
	pdf.SetFillColor(int(mainColor.R), int(mainColor.G), int(mainColor.B))
	// Go to next line
	pdf.Ln(-1)

	// Insert TVA and total HT, TTC
	var totalTTC = getBillTotal(bill)
	var totalHT = getBillTotalHT(bill)
	var totalTVA = totalTTC - totalHT

	if hasVat {
		pdf.SetX(marginL + cols[0] + cols[1])
		pdf.CellFormat(cols[2]+cols[3], float64(totalAndTvaCellHeight), TOTALHT_TITLE, "1", 0, "C", true, 0, "")
		pdf.CellFormat(cols[4], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%.2f€", totalHT)), "1", 0, "C", false, 0, "")
		pdf.Ln(-1)
		pdf.SetX(marginL + cols[0] + cols[1])
		pdf.CellFormat(cols[2]+cols[3], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%s (%.2f)%%", VAT_TITLE, tva)), "1", 0, "C", true, 0, "")
		pdf.CellFormat(cols[4], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%.2f€", totalTVA)), "1", 0, "C", false, 0, "")
		pdf.Ln(-1)
	}

	// Insert the quote total
	pdf.SetFont(fontFamily, "B", fontSize)
	if !hasVat {
		pdf.SetX(marginL + cols[0] + cols[1])
		pdf.CellFormat(cols[2], float64(totalAndTvaCellHeight), TOTALHT_TITLE, "1", 0, "C", true, 0, "")
		pdf.CellFormat(cols[3], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%.2f€", totalHT)), "1", 0, "C", false, 0, "")
	} else {
		pdf.SetX(marginL + cols[0] + cols[1])
		pdf.CellFormat(cols[2]+cols[3], float64(totalAndTvaCellHeight), TOTALTTC_TITLE, "1", 0, "C", true, 0, "")
		pdf.CellFormat(cols[4], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%.2f€", totalTTC)), "1", 0, "C", false, 0, "")

	}
	pdf.SetY(pdf.GetY() + lineHt*3)

	// Insert a new page if afterTableLines doesnt fit on the current one
	pdf.SetFont(fontFamily, "", fontSize)
	afterTableLines := pdf.SplitText(customization.AfterTable, pageSize.Wd-marginL*2)
	height := float64(len(afterTableLines))*lineHt + cellMargin*float64(len(afterTableLines))
	if pdf.GetY()+height > pageSize.Ht-float64(marginB)-10 {
		pdf.AddPage()
	}

	// Insert the afterTableLines
	for index, line := range afterTableLines {
		if index == len(afterTableLines) {
			pdf.MultiCell(pageSize.Wd-marginL*2, lineHt+cellMargin, tr(line), "", "", false)
		} else {
			pdf.MultiCell(pageSize.Wd-marginL*2, lineHt+cellMargin, tr(line), "", "", false)
		}
	}

	// Create the final directory
	err = os.MkdirAll(fmt.Sprintf(FOLDER, config.Get().UploadDir, company.ID), os.ModePerm)
	if err != nil {
		log.Panicln(err.Error())
	}

	// Save the pdf
	err = pdf.OutputFileAndClose(fmt.Sprintf(FOLDER+"/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
	if err != nil {
		log.Panicln(err.Error())
	}

	// Get it and return it
	file, err := os.Open(fmt.Sprintf(FOLDER+"/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
	if err != nil {
		log.Panicln(err.Error())
	}
	return file
}

func getBillTotal(bill models.Bill) float64 {
	total := 0.0
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(*bill.Tva / 100)
	}
	for _, line := range bill.Lines {
		total += getLinePrice(line.Price, line.Quantity, tva)
	}
	return roundTwoDecimals(total)
}

func getBillTotalHT(bill models.Bill) float64 {
	total := 0.0
	for _, line := range bill.Lines {
		total += getLinePrice(line.Price, line.Quantity, 0)
	}
	return roundTwoDecimals(total)
}
