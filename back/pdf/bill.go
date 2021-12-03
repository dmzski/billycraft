package pdf

import (
	"backv2/billCustomization"
	"backv2/company"
	"backv2/config"
	"backv2/customers"
	"backv2/models"
	"fmt"
	"log"
	"os"
	"time"

	"image/color"
	_ "image/jpeg"
	_ "image/png"

	"github.com/jung-kurt/gofpdf"
	"github.com/jung-kurt/gofpdf/contrib/httpimg"
)

var (
	blackRGB              = color.RGBA{R: 0, G: 0, B: 0, A: 255}
	whiteRGB              = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	grayRGB               = color.RGBA{R: 230, G: 230, B: 230, A: 255}
	marginL               = 5.0
	marginB               = 25
	cellMargin            = 2.0
	lineMargin            = 1.0
	cols                  = []float64{135, 20, 20, 25}
	totalAndTvaCellHeight = 8
)

func generateBillPDF(bill models.Bill) *os.File {
	c := company.DAO.FindOneById(bill.CompanyID)
	bc := billCustomization.DAO.FindFirstByTenant(bill.CompanyID)
	customer := models.Customer{}
	if bill.CustomerID != nil {
		customer = customers.DAO.FindOneByIdAndTenant(*bill.CustomerID, bill.CompanyID)
	}
	rgba, err := parseHexColor(bc.MainColor)
	if err != nil {
		rgba = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	}
	pdf := gofpdf.New("P", "mm", "A4", "")
	pageSize := pdf.GetPageSizeStr("A4")
	pdf.AddPage()
	pdf.SetMargins(marginL, marginL, marginL)
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.SetFont("Arial", "", 10)
	pdf.SetAutoPageBreak(false, 0)
	pdf.SetFooterFunc(func() {
		pdf.SetY(pageSize.Ht - float64(marginB))
		pdf.SetX(marginL)
		pdf.SetFont("Arial", "I", 5)
		pdf.MultiCell(pageSize.Wd-marginL*2, 5, tr(bc.Footer), "", "L", false)
	})

	if c.Logo != nil {
		httpimg.Register(pdf, *c.Logo, "png")
		opt := gofpdf.ImageOptions{
			ImageType: "png",
		}
		pdf.ImageOptions(*c.Logo, marginL, marginL, 30, 30, false, opt, 0, "")
	}
	pdf.SetX(-100 - marginL)

	date := time.Now()
	_, lineHt := pdf.GetFontSize()

	pdf.CellFormat(100, 5, tr("Date d'émission : "+date.Format("02/01/2006")), "0", 1, "R", false, 0, "")
	pdf.Ln(2)

	pdf.SetX(-50 - marginL)
	pdf.SetFont("Arial", "B", 14)
	pdf.SetLineWidth(1)
	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))
	pdf.CellFormat(50, 10, tr("FACTURE"), "1", 1, "C", true, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.SetY(35)
	pdf.SetX(marginL)
	companyStr := fmt.Sprintf("%s\n%s\n%s, %s", c.Name, c.Address, c.PostalCode, c.City)
	pdf.SetY(pdf.GetY() + lineHt)
	y := pdf.GetY()
	pdf.MultiCell(cols[0], lineHt+lineMargin, tr(companyStr), "0", "L", false)
	afterCompanyY := pdf.GetY()
	pdf.SetY(y)
	pdf.SetX(pageSize.Wd - marginL - cols[1] - cols[2] - cols[3])
	if customer.Name != "" {
		customerStr := customer.Name + "\n" + customer.Address + "\n" + customer.PostalCode + ", " + customer.City
		pdf.MultiCell(cols[1]+cols[2]+cols[3], lineHt+lineMargin, tr(customerStr), "0", "R", false)
	}
	afterCustomerY := pdf.GetY()

	if afterCompanyY > afterCustomerY {
		y = afterCompanyY
	} else {
		y = afterCustomerY
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.SetY(y + cellMargin)
	pdf.MultiCell(pageSize.Wd-marginL*2, lineHt, tr("Référence : "+bill.ID), "", "R", false)
	pdf.SetY(pdf.GetY() + lineHt)
	pdf.MultiCell(pageSize.Wd-marginL*2, lineHt, tr("Objet : "+bill.Title), "", "L", false)
	pdf.SetY(pdf.GetY() + lineHt)

	pdf.SetFont("Arial", "B", 10)
	addBillHeaders(pdf, bc)

	reportTotal := 0.0
	totalAndTvaHeight := totalAndTvaCellHeight

	if bill.Tva != nil && *bill.Tva > 0 {
		totalAndTvaHeight *= 2
	}

	for i, line := range bill.Lines {
		pdf.SetFont("Arial", "", 10)
		pdf.SetX(marginL)

		lineColor := whiteRGB
		if i%2 == 1 {
			lineColor = grayRGB
		}
		pdf.SetFillColor(int(lineColor.R), int(lineColor.G), int(lineColor.B))

		quantity := fmt.Sprintf("%.2f", line.Quantity)
		price := fmt.Sprintf("%.2f€", line.Price)
		linePrice := getLinePrice(bill, line)
		subtotal := fmt.Sprintf("%.2f€", linePrice)

		lines := pdf.SplitLines([]byte(line.Name), cols[0]-15)
		descriptionLines := pdf.SplitLines([]byte(line.Description), cols[0]-20)
		height := float64(len(lines)+len(descriptionLines))*lineHt + lineMargin*float64(len(lines)+len(descriptionLines)) + cellMargin*2

		// The height oof the row more the height of total and tva
		if pdf.GetY()+height+(lineHt+lineMargin*4)*2 > pageSize.Ht-float64(marginB)-10 {
			pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())
			addBillTotal(pdf, reportTotal)
			pdf.AddPage()
			addBillHeaders(pdf, bc)
		}

		pdf.SetFont("Arial", "B", 10)
		pdf.SetDrawColor(pdf.GetFillColor())
		pdf.Rect(pdf.GetX(), pdf.GetY(), float64(pageSize.Wd-marginL*2), float64(height), "F")
		pdf.SetDrawColor(int(blackRGB.R), int(blackRGB.G), int(blackRGB.B))

		currentY := pdf.GetY()
		pdf.SetXY(marginL+cellMargin, currentY+cellMargin)

		if line.Price == 0 {
			price = "OFFERT"
			subtotal = "OFFERT"
		}

		if line.Price == 0 && line.Quantity == 0 && line.Description == "" {
			pdf.SetFont("Arial", "B", 10)
			pdf.SetCellMargin(lineMargin)
			quantity = ""
			price = ""
			subtotal = ""
		} else {
			pdf.SetFont("Arial", "", 10)
		}

		for _, line := range lines {
			pdf.SetX(marginL + cellMargin)
			pdf.MultiCell(cols[0]-cellMargin, lineHt+lineMargin, tr(string(line)), "", "", false)
		}

		pdf.SetFont("Arial", "", 10)

		for _, descriptionLine := range descriptionLines {
			pdf.SetX(marginL + cellMargin*2)
			pdf.MultiCell(cols[0]-cellMargin*2, lineHt+lineMargin, tr(string(descriptionLine)), "", "", false)
		}
		pdf.SetXY(marginL+cols[0], currentY)
		pdf.CellFormat(cols[1], height, quantity, "", 0, "C", true, 0, "")
		pdf.CellFormat(cols[2], height, tr(price), "", 0, "C", true, 0, "")
		pdf.CellFormat(cols[3], height, tr(subtotal), "", 0, "C", true, 0, "")

		// Cell borders
		pdf.Line(marginL, currentY, marginL, currentY+float64(height))
		pdf.Line(marginL+cols[0], currentY, marginL+cols[0], currentY+float64(height))
		pdf.Line(marginL+cols[0]+cols[1], currentY, marginL+cols[0]+cols[1], currentY+float64(height))
		pdf.Line(marginL+cols[0]+cols[1]+cols[2], currentY, marginL+cols[0]+cols[1]+cols[2], currentY+float64(height))
		pdf.Line(marginL+cols[0]+cols[1]+cols[2]+cols[3], currentY, marginL+cols[0]+cols[1]+cols[2]+cols[3], currentY+float64(height))

		pdf.SetXY(marginL, currentY+height)

		if linePrice > 0 {
			reportTotal += linePrice
		}
	}
	pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())

	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))

	if bill.Tva != nil && *bill.Tva > 0 {
		pdf.SetX(marginL + cols[0] + cols[1])
		pdf.CellFormat(20, float64(totalAndTvaCellHeight), "TVA", "1", 0, "C", true, 0, "")
		pdf.CellFormat(25, float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%d", *bill.Tva)+"%"), "1", 0, "C", false, 0, "")
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.Ln(-1)
	pdf.SetX(marginL + cols[0] + cols[1])
	pdf.CellFormat(cols[2], float64(totalAndTvaCellHeight), "Total", "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%.2f", getBillTotal(bill))+"€"), "1", 0, "C", false, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.SetY(pdf.GetY() + lineHt*3)
	afterTableLines := pdf.SplitText(bc.AfterTable, pageSize.Wd-marginL*2)
	height := float64(len(afterTableLines))*lineHt + cellMargin*float64(len(afterTableLines))
	if pdf.GetY()+height > pageSize.Ht-float64(marginB)-10 {
		pdf.AddPage()
	}

	for index, line := range afterTableLines {
		if index == len(afterTableLines) {
			pdf.MultiCell(pageSize.Wd-marginL*2, lineHt+cellMargin, tr(line), "", "", false)
		} else {
			pdf.MultiCell(pageSize.Wd-marginL*2, lineHt+cellMargin, tr(line), "", "", false)
		}
	}

	err = os.MkdirAll(fmt.Sprintf("%s/%d/bills", config.Get().UploadDir, c.ID), os.ModePerm)
	if err != nil {
		log.Panicln(err.Error())
	}

	err = pdf.OutputFileAndClose(fmt.Sprintf("%s/%d/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.ID))
	if err != nil {
		log.Panicln(err.Error())
	}

	file, err := os.Open(fmt.Sprintf("%s/%d/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.ID))
	if err != nil {
		log.Panicln(err.Error())
	}
	return file
}

func getBillTotal(bill models.Bill) float64 {
	total := 0.0
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(int(*bill.Tva) / 100)
	}
	for _, line := range bill.Lines {
		total += float64(line.Quantity) * (line.Price + (line.Price * tva))
	}

	return total

}

func getLinePrice(bill models.Bill, line models.BillLine) float64 {
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(int(*bill.Tva) / 100)
	}

	return line.Quantity * (line.Price + (line.Price * tva))

}

func addBillHeaders(pdf gofpdf.Pdf, bc models.BillCustomization) {
	rgba, err := parseHexColor(bc.MainColor)
	if err != nil {
		rgba = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	}
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	currentR, currentG, currentB := pdf.GetFillColor()
	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))
	pdf.SetFont("Arial", "B", 10)
	pdf.SetX(marginL)
	pdf.SetLineWidth(0.3)
	pdf.CellFormat(cols[0], 10, tr("Désignation"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[1], 10, tr("Quantité"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[2], 10, tr("Prix HT"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], 10, tr("Sous Total"), "1", 0, "C", true, 0, "")
	pdf.Ln(-1)
	pdf.SetFillColor(currentR, currentG, currentB)
}

func addBillTotal(pdf gofpdf.Pdf, reportTotal float64) {
	reportTotalCellWidth := 40
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	_, height := pdf.GetPageSize()
	pdf.SetY(height - float64(marginB) - 10)
	pdf.SetFont("Arial", "B", 10)
	pdf.SetX(marginL + cols[0] + cols[1] + cols[2] - float64(reportTotalCellWidth))
	pdf.CellFormat(float64(reportTotalCellWidth), 10, tr("Total reporté"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], 10, tr(fmt.Sprintf("%.2f", reportTotal)+"€"), "1", 0, "C", false, 0, "")
	pdf.SetFont("Arial", "", 10)
}
