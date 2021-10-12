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

var (
	fillWhite  = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	fillGray   = color.RGBA{R: 230, G: 230, B: 230, A: 255}
	marginL    = 5.0
	marginB    = 25
	cellMargin = 1.0
	cols       = []float64{135, 20, 20, 25}
)

func generateQuotePDF(quote models.Quote) *os.File {

	c := company.DAO.FindOneById(quote.CompanyID)
	qc := quoteCustomization.DAO.FindFirstByTenant(quote.CompanyID)
	customer := customers.DAO.FindOneByIdAndTenant(*quote.CustomerID, quote.CompanyID)
	rgba, err := parseHexColor(qc.MainColor)
	if err != nil {
		rgba = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	}
	pdf := gofpdf.New("P", "mm", "A4", "")
	_, lineHt := pdf.GetFontSize()
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
		opt := gofpdf.ImageOptions{}
		opt.ImageType = "png"
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
	pdf.SetFont("Arial", "B", 10)

	pdf.Ln(3)

	pdf.SetX(marginL)
	pdf.SetLineWidth(0.3)
	pdf.CellFormat(cols[0], 8, tr("Désignation"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[1], 8, tr("Quantité"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[2], 8, tr("Prix HT"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], 8, tr("Sous Total"), "1", 0, "C", true, 0, "")
	pdf.Ln(-1)

	_, lineHt = pdf.GetFontSize()
	reportTotal := 0.0

	for i, line := range quote.Lines {
		pdf.SetFont("Arial", "", 10)
		pdf.SetCellMargin(4)
		lineColor := fillWhite
		borderStr := "LR"

		if i%2 == 1 {
			lineColor = fillGray
		}
		if i == len(quote.Lines)-1 {
			borderStr = "LBR"
		}
		pdf.SetFillColor(int(lineColor.R), int(lineColor.G), int(lineColor.B))
		pdf.SetX(marginL)

		quantity := fmt.Sprintf("%.2f", line.Quantity)
		price := fmt.Sprintf("%.2f€", line.Price)
		linePrice := getLinePrice(quote, line)
		subtotal := fmt.Sprintf("%.2f€", linePrice)
		if linePrice > 0 {
			reportTotal += linePrice
		}

		lines := pdf.SplitText(line.Name, 135)
		descriptionLines := pdf.SplitText(line.Description, 135)
		height := float64(len(lines)+len(descriptionLines))*lineHt + cellMargin*float64(len(lines)+len(descriptionLines))

		if pdf.GetY()+height > pageSize.Ht-float64(marginB)-10 {
			pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())
			addTotal(pdf, reportTotal)
			pdf.AddPage()
			addHeaders(pdf, qc)
		}

		if line.Price == 0 && line.Quantity == 0 {
			pdf.SetFont("Arial", "B", 10)
			pdf.SetCellMargin(cellMargin)
			quantity = ""
			price = ""
			subtotal = ""
		}
		if line.Price == 0 && line.Quantity != 0 {
			price = "OFFERT"
			subtotal = "OFFERT"
		}
		pdf.SetFont("Arial", "B", 10)
		currentY := pdf.GetY()
		for index, line := range lines {
			if index == len(lines) {
				pdf.MultiCell(cols[0], lineHt+cellMargin, tr(line), "LBR", "", true)
			} else {
				pdf.MultiCell(cols[0], lineHt+cellMargin, tr(line), "LR", "", true)
			}
		}
		pdf.SetFont("Arial", "", 10)

		for index, descriptionLine := range descriptionLines {
			if index == len(descriptionLines) {
				pdf.MultiCell(cols[0], lineHt+cellMargin, tr(descriptionLine), "LBR", "", true)
			} else {
				pdf.MultiCell(cols[0], lineHt+cellMargin, tr(descriptionLine), "LR", "", true)
			}
		}
		pdf.SetXY(marginL+cols[0], currentY)
		pdf.CellFormat(cols[1], height, quantity, borderStr, 0, "C", true, 0, "")
		pdf.CellFormat(cols[2], height, tr(price), borderStr, 0, "C", true, 0, "")
		pdf.CellFormat(cols[3], height, tr(subtotal), borderStr, 0, "C", true, 0, "")
		pdf.Ln(-1)
	}
	pdf.Line(marginL, pdf.GetY(), 135+20+20+25, pdf.GetY())

	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))

	if quote.Tva != nil && *quote.Tva > 0 {
		pdf.SetX(marginL + 135 + 20)
		pdf.CellFormat(20, 8, "TVA", "1", 0, "C", true, 0, "")
		pdf.CellFormat(25, 8, tr(fmt.Sprintf("%d", *quote.Tva)+"%"), "1", 0, "C", false, 0, "")
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.Ln(-1)
	pdf.SetX(marginL + cols[0] + cols[1])
	pdf.CellFormat(cols[2], 8, "Total", "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], 8, tr(fmt.Sprintf("%.2f", getQuoteTotal(quote))+"€"), "1", 0, "C", false, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.Ln(7)

	pdf.MultiCell(marginL, 7, tr(qc.AfterTable), "0", "", false)

	os.MkdirAll(config.Get().PdfDir+fmt.Sprintf("%d", c.ID)+"/quotes/", os.ModePerm)
	file, err := os.Create(config.Get().PdfDir + fmt.Sprintf("%d", c.ID) + "/quotes/" + quote.ID + ".pdf")
	if err != nil {
		log.Println(err.Error())
	}

	err = pdf.OutputFileAndClose(file.Name())
	if err != nil {
		log.Println(err.Error())
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

func getLinePrice(quote models.Quote, line models.QuoteLine) float64 {
	tva := 0.0
	if quote.Tva != nil && *quote.Tva > 0 {
		tva = float64(int(*quote.Tva) / 100)
	}

	return line.Quantity * (line.Price + (line.Price * tva))

}

func addHeaders(pdf gofpdf.Pdf, qc models.QuoteCustomization) {
	rgba, err := parseHexColor(qc.MainColor)
	if err != nil {
		rgba = color.RGBA{R: 0, G: 0, B: 255, A: 255}
	}
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))
	pdf.SetFont("Arial", "B", 10)
	pdf.SetX(marginL)
	pdf.SetLineWidth(0.3)
	pdf.CellFormat(cols[0], 10, tr("Désignation"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[1], 10, tr("Quantité"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[2], 10, tr("Prix HT"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[3], 10, tr("Sous Total"), "1", 0, "C", true, 0, "")
	pdf.Ln(-1)
}

func addTotal(pdf gofpdf.Pdf, reportTotal float64) {
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
