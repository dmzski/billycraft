package pdf

import (
	"backv2/company"
	"backv2/config"
	"backv2/customers"
	"backv2/models"
	"backv2/quoteCustomization"
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

func generateQuotePDF(quote models.Quote) *os.File {

	c := company.DAO.FindOneById(quote.CompanyID)
	qc := quoteCustomization.DAO.FindFirstByTenant(quote.CompanyID)
	customer := models.Customer{}
	if quote.CustomerID != nil {
		customer = customers.DAO.FindOneByIdAndTenant(*quote.CustomerID, quote.CompanyID)
	}
	rgba, err := parseHexColor(qc.MainColor)
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
		pdf.MultiCell(pageSize.Wd-marginL*2, 5, tr(qc.Footer), "", "L", false)
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

	pdf.CellFormat(100, 5, tr("Date d'émission : "+date.Format("02/01/2006")), "0", 1, "R", false, 0, "")
	pdf.Ln(2)

	pdf.SetX(-50 - marginL)
	pdf.SetFont("Arial", "B", 14)
	pdf.SetLineWidth(1)
	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))
	pdf.CellFormat(50, 10, tr("DEVIS"), "1", 1, "C", true, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.SetY(35)
	pdf.SetX(5)
	companyStr := fmt.Sprintf("%s\n%s\n%s, %s", c.Name, c.Address, c.PostalCode, c.City)
	y := pdf.GetY()
	pdf.MultiCell(100, 5, tr(companyStr), "0", "L", false)
	pdf.SetY(y + 4)
	pdf.SetX(-100 - marginL)
	if customer.Name != "" {
		customerStr := customer.Name + "\n" + customer.Address + "\n" + customer.PostalCode + ", " + customer.City
		pdf.MultiCell(100, 5, tr(customerStr), "0", "R", false)
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.CellFormat(0, 10, tr("Référence du devis : "+quote.ID), "0", 1, "R", false, 0, "")
	pdf.CellFormat(0, 5, tr("Objet du devis : "+quote.Title), "0", 1, "L", false, 0, "")

	pdf.Ln(3)

	pdf.SetFont("Arial", "B", 10)
	addQuoteHeaders(pdf, qc)

	_, lineHt := pdf.GetFontSize()
	reportTotal := 0.0
	totalAndTvaHeight := totalAndTvaCellHeight

	if quote.Tva != nil && *quote.Tva > 0 {
		totalAndTvaHeight *= 2
	}

	for i, line := range quote.Lines {
		pdf.SetFont("Arial", "", 10)
		pdf.SetX(marginL)

		lineColor := whiteRGB
		if i%2 == 1 {
			lineColor = grayRGB
		}
		pdf.SetFillColor(int(lineColor.R), int(lineColor.G), int(lineColor.B))

		quantity := fmt.Sprintf("%.2f", line.Quantity)
		price := fmt.Sprintf("%.2f€", line.Price)
		linePrice := getQuoteLinePrice(quote, line)
		subtotal := fmt.Sprintf("%.2f€", linePrice)
		if linePrice > 0 {
			reportTotal += linePrice
		}

		lines := pdf.SplitLines([]byte(line.Name), cols[0]-cellMargin)
		descriptionLines := pdf.SplitLines([]byte(line.Description), cols[0]-cellMargin)
		height := float64(len(lines)+len(descriptionLines))*lineHt + lineMargin*float64(len(lines)+len(descriptionLines)) + cellMargin*2

		// The height oof the row more the height of total and tva
		if pdf.GetY()+height+(lineHt+lineMargin*4)*2 > pageSize.Ht-float64(marginB)-10 {
			pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())
			addQuoteTotal(pdf, reportTotal)
			pdf.AddPage()
			addQuoteHeaders(pdf, qc)
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
	}
	pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())

	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))

	if quote.Tva != nil && *quote.Tva > 0 {
		pdf.SetX(marginL + cols[0] + cols[1])
		pdf.CellFormat(20, float64(totalAndTvaCellHeight), "TVA", "1", 0, "C", true, 0, "")
		pdf.CellFormat(25, float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%d", *quote.Tva)+"%"), "1", 0, "C", false, 0, "")
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.Ln(-1)
	pdf.SetX(marginL + cols[0] + cols[1])
	pdf.CellFormat(cols[2], float64(totalAndTvaCellHeight), "Total", "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], float64(totalAndTvaCellHeight), tr(fmt.Sprintf("%.2f", getQuoteTotal(quote))+"€"), "1", 0, "C", false, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.SetY(pdf.GetY() + lineHt*3)
	afterTableLines := pdf.SplitText(qc.AfterTable, pageSize.Wd-marginL*2)
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

	err = os.MkdirAll(fmt.Sprintf("%s/%d/quotes", config.Get().UploadDir, c.ID), os.ModePerm)
	if err != nil {
		log.Panicln(err.Error())
	}

	err = pdf.OutputFileAndClose(fmt.Sprintf("%s/%d/quotes/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.ID))
	if err != nil {
		log.Panicln(err.Error())
	}

	file, err := os.Open(fmt.Sprintf("%s/%d/quotes/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.ID))
	if err != nil {
		log.Panicln(err.Error())
	}
	return file
}

func getQuoteTotal(quote models.Quote) float64 {
	total := 0.0
	tva := 0.0
	if quote.Tva != nil && *quote.Tva > 0 {
		tva = float64(int(*quote.Tva) / 100)
	}
	for _, line := range quote.Lines {
		total += float64(line.Quantity) * (line.Price + (line.Price * tva))
	}

	return total

}

func getQuoteLinePrice(quote models.Quote, line models.QuoteLine) float64 {
	tva := 0.0
	if quote.Tva != nil && *quote.Tva > 0 {
		tva = float64(int(*quote.Tva) / 100)
	}

	return line.Quantity * (line.Price + (line.Price * tva))

}

func addQuoteHeaders(pdf gofpdf.Pdf, qc models.QuoteCustomization) {
	rgba, err := parseHexColor(qc.MainColor)
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

func addQuoteTotal(pdf gofpdf.Pdf, reportTotal float64) {
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
