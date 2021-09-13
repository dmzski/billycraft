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
	customer := customers.DAO.FindOneByIdAndTenant(*quote.CustomerID, quote.CompanyID)
	rgba, err := parseHexColor(qc.MainColor)
	if err != nil {
		rgba = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	}
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetMargins(5, 5, 5)
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pdf.SetFont("Arial", "", 10)
	pdf.SetFooterFunc(func() {
		pdf.SetY(-20)
		pdf.SetX(2)
		pdf.SetFont("Arial", "I", 8)
		pdf.MultiCell(206, 3, tr(qc.Footer), "", "L", false)
	})
	// CellFormat(width, height, text, border, position after, align, fill, link, linkStr)
	// pdf.CellFormat(190, 7, "Welcome to golangcode.com", "0", 0, "CM", false, 0, "")

	if c.Logo != nil {
		httpimg.Register(pdf, *c.Logo, "png")
		opt := gofpdf.ImageOptions{}
		opt.ImageType = "png"
		pdf.ImageOptions(*c.Logo, 5, 5, 30, 30, false, opt, 0, "")
	}
	pdf.SetX(-110)

	date := time.Now()

	pdf.CellFormat(100, 5, tr("Date d'émission : "+date.Format("02/01/2006")), "0", 1, "R", false, 0, "")
	pdf.Ln(2)

	pdf.SetX(-60)
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
	pdf.SetX(-110)
	if customer.Name != "" {
		customerStr := customer.Name + "\n" + customer.Address + "\n" + customer.PostalCode + ", " + customer.City
		pdf.MultiCell(100, 5, tr(customerStr), "0", "R", false)
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.CellFormat(0, 10, tr("Référence du devis : "+quote.ID), "0", 1, "R", false, 0, "")
	pdf.CellFormat(0, 5, tr("Objet du devis : "+quote.Title), "0", 1, "L", false, 0, "")
	pdf.SetFont("Arial", "B", 10)

	pdf.Ln(3)

	left := 5.0
	pdf.SetX(left)
	pdf.SetLineWidth(0.3)
	pdf.CellFormat(135, 8, tr("Désignation"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(20, 8, tr("Quantité"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(20, 8, tr("Prix HT"), "1", 0, "C", true, 0, "")
	pdf.CellFormat(25, 8, tr("Sous Total"), "1", 0, "C", true, 0, "")
	pdf.Ln(-1)

	pdf.SetAutoPageBreak(true, 10)

	fillWhite := color.RGBA{R: 255, G: 255, B: 255, A: 255}
	fillGray := color.RGBA{R: 230, G: 230, B: 230, A: 255}
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
		pdf.SetX(left)
		y := pdf.GetY()
		quantity := fmt.Sprintf("%.2f", line.Quantity)
		price := fmt.Sprintf("%.2f€", line.Price)
		subtotal := fmt.Sprintf("%.2f€", line.Price*float64(line.Quantity))

		if line.Price == 0 && line.Quantity == 0 {
			pdf.SetFont("Arial", "B", 10)
			pdf.SetCellMargin(2)
			quantity = ""
			price = ""
			subtotal = ""
		}
		if line.Price == 0 && line.Quantity != 0 {
			price = "OFFERT"
			subtotal = "OFFERT"
		}
		pdf.SetFont("Arial", "B", 10)
		pdf.MultiCell(135, 5, tr(line.Name), "LR", "", true)
		pdf.SetFont("Arial", "", 10)
		descriptionLines := pdf.SplitText(line.Description, 135)
		for index, descriptionLine := range descriptionLines {
			if index == len(descriptionLines) {
				pdf.MultiCell(135, 5, tr(descriptionLine), "LBR", "", true)
			} else {
				pdf.MultiCell(135, 5, tr(descriptionLine), "LR", "", true)
			}
		}
		pdf.SetY(y)
		pdf.SetX(left + 135)
		pdf.CellFormat(20, 10, quantity, borderStr, 0, "C", true, 0, "")
		pdf.CellFormat(20, 10, tr(price), borderStr, 0, "C", true, 0, "")
		pdf.CellFormat(25, 10, tr(subtotal), borderStr, 0, "C", true, 0, "")
		pdf.Ln(-1)
	}
	pdf.Line(left, pdf.GetY(), 135+20+20+25, pdf.GetY())

	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))

	if quote.Tva != nil && *quote.Tva > 0 {
		pdf.SetX(left + 135 + 20)
		pdf.CellFormat(20, 8, "TVA", "1", 0, "C", true, 0, "")
		pdf.CellFormat(25, 8, tr(fmt.Sprintf("%d", *quote.Tva)+"%"), "1", 0, "C", false, 0, "")
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.Ln(-1)
	pdf.SetX(left + 135 + 20)
	pdf.CellFormat(20, 8, "Total", "1", 0, "C", true, 0, "")
	pdf.CellFormat(25, 8, tr(fmt.Sprintf("%.2f", getQuoteTotal(quote))+"€"), "1", 0, "C", false, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.Ln(7)

	pdf.MultiCell(0, 7, tr(qc.AfterTable), "0", "", false)

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
