package generators

import (
	"coco-erp/pdf-service/models"
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

func GenerateQuotePDF(q *models.Quote, c *models.Company, qc *models.QuoteCustomization) *os.File {
	rgba, err := ParseHexColor(qc.MainColor)
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

	httpimg.Register(pdf, c.Logo, "png")
	opt := gofpdf.ImageOptions{}
	opt.ImageType = "png"
	pdf.ImageOptions(c.Logo, 5, 5, 30, 30, false, opt, 0, "")
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
	companyStr := c.Name + "\n" + c.Address + "\n" + c.PostalCode + ", " + c.City
	y := pdf.GetY()
	pdf.MultiCell(100, 5, tr(companyStr), "0", "L", false)
	pdf.SetY(y + 4)
	pdf.SetX(-110)
	customerStr := q.Customer.Name + "\n" + q.Customer.Address + "\n" + q.Customer.PostalCode + ", " + q.Customer.City
	pdf.MultiCell(100, 5, tr(customerStr), "0", "R", false)

	pdf.SetFont("Arial", "B", 10)
	pdf.CellFormat(0, 10, tr("Référence du devis : "+q.ID), "0", 1, "R", false, 0, "")
	pdf.CellFormat(0, 5, tr("Objet du devis : "+q.Title), "0", 1, "L", false, 0, "")
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

	pdf.SetAutoPageBreak(true, 15)

	fillWhite := color.RGBA{R: 255, G: 255, B: 255, A: 255}
	fillGray := color.RGBA{R: 230, G: 230, B: 230, A: 255}
	for i, line := range q.Lines {
		pdf.SetFont("Arial", "", 10)
		pdf.SetCellMargin(4)
		lineColor := fillWhite
		borderStr := "LR"

		if i%2 == 1 {
			lineColor = fillGray
		}
		if i == len(q.Lines)-1 {
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

		pdf.MultiCell(135, 5, tr(line.Description), borderStr, "", true)
		height := pdf.GetY() - y
		pdf.SetY(y)
		pdf.SetX(left + 135)
		pdf.CellFormat(20, height, quantity, borderStr, 0, "C", true, 0, "")
		pdf.CellFormat(20, height, tr(price), borderStr, 0, "C", true, 0, "")
		pdf.CellFormat(25, height, tr(subtotal), borderStr, 0, "C", true, 0, "")
		pdf.Ln(-1)
	}

	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))

	if q.Tva > 0 {
		pdf.SetX(left + 135 + 20)
		pdf.CellFormat(20, 8, "TVA", "1", 0, "C", true, 0, "")
		pdf.CellFormat(25, 8, tr(fmt.Sprintf("%d", q.Tva)+"%"), "1", 0, "C", false, 0, "")
	}

	pdf.SetFont("Arial", "B", 10)
	pdf.Ln(-1)
	pdf.SetX(left + 135 + 20)
	pdf.CellFormat(20, 8, "Total", "1", 0, "C", true, 0, "")
	pdf.CellFormat(25, 8, tr(fmt.Sprintf("%.2f", getQuoteTotal(q))+"€"), "1", 0, "C", false, 0, "")
	pdf.SetFont("Arial", "", 10)

	pdf.Ln(7)

	pdf.MultiCell(0, 7, tr(qc.AfterTable), "0", "", false)

	os.MkdirAll("pdfs/"+fmt.Sprintf("%d", c.ID)+"/quotes/", os.ModePerm)
	file, err := os.Create("pdfs/" + fmt.Sprintf("%d", c.ID) + "/quotes/" + q.ID + ".pdf")
	if err != nil {
		log.Println(err.Error())
	}

	err = pdf.OutputFileAndClose(file.Name())
	if err != nil {
		log.Println(err.Error())
	}
	return file
}

func getQuoteTotal(q *models.Quote) float64 {
	total := 0.0
	tva := 0.0
	if q.Tva > 0 {
		tva = float64(int(q.Tva) / 100)
	}
	for _, line := range q.Lines {
		total += float64(line.Quantity) * (line.Price + (line.Price * tva))
	}

	return total

}
