package pdf

import (
	"back/internal/lib/models"
	"errors"
	"fmt"
	"image/color"
	"math"

	"github.com/jung-kurt/gofpdf"
)

var errInvalidFormat = errors.New("invalid format")
var (
	blackRGB                = color.RGBA{R: 0, G: 0, B: 0, A: 255}
	whiteRGB                = color.RGBA{R: 255, G: 255, B: 255, A: 255}
	grayRGB                 = color.RGBA{R: 230, G: 230, B: 230, A: 255}
	marginL                 = 5.0
	marginB                 = 25.0
	cellMargin              = 2.0
	cellMarginLarge         = 15.0
	lineMargin              = 1.0
	colsWithVat             = []float64{115, 20, 20, 20, 25}
	colsWithoutVat          = []float64{135, 20, 20, 25}
	totalAndTvaCellHeight   = 10.0
	reportTotalCellWidth    = 40
	fontSize                = 10.0
	fontFamily              = "Arial"
	QUOTE_TITLE             = "DEVIS"
	BILL_TITLE              = "FACTURE"
	DESIGNATION_TITLE       = "Désignation"
	QUANTITY_TITLE          = "Quantité"
	PRICE_TTC_TITLE         = "Prix TTC"
	PRICE_HT_TITLE          = "Prix HT"
	SUBTOTALTTC_TITLE       = "Sous total TTC"
	SUBTOTALHT_TITLE        = "Sous total HT"
	REPORTED_TOTALTTC_TITLE = "Total reporté TTC"
	REPORTED_TOTALHT_TITLE  = "Total reporté HT"
	DATE_TITLE              = "Date d'émission"
	REFERENCE_TITLE         = "Référence"
	OBJECT_TITLE            = "Objet"
	FREE_STR                = "OFFERT"
	TOTALTTC_TITLE          = "Total TTC"
	TOTALHT_TITLE           = "Total HT"
	VAT_TITLE               = "TVA"
	QUOTES_FOLDER           = "%s/%s/quotes"
	BILLS_FOLDER            = "%s/%s/bills"
)

func parseHexColor(s string) (c color.RGBA, err error) {
	c.A = 0xff

	if s == "" || s[0] != '#' {
		return c, errInvalidFormat
	}

	hexToByte := func(b byte) byte {
		switch {
		case b >= '0' && b <= '9':
			return b - '0'
		case b >= 'a' && b <= 'f':
			return b - 'a' + 10
		case b >= 'A' && b <= 'F':
			return b - 'A' + 10
		}
		err = errInvalidFormat
		return 0
	}

	switch len(s) {
	case 7:
		c.R = hexToByte(s[1])<<4 + hexToByte(s[2])
		c.G = hexToByte(s[3])<<4 + hexToByte(s[4])
		c.B = hexToByte(s[5])<<4 + hexToByte(s[6])
	case 4:
		c.R = hexToByte(s[1]) * 17
		c.G = hexToByte(s[2]) * 17
		c.B = hexToByte(s[3]) * 17
	default:
		err = errInvalidFormat
	}
	return
}

func getCompagnyStr(c models.Company, displayCompanyEmail bool, displayCompanyPhoneNumber bool) string {

	companyStr := fmt.Sprintf("%s\n%s\n%s, %s", c.Name, c.Address, c.PostalCode, c.City)
	if displayCompanyEmail {
		companyStr += fmt.Sprintf("\n%s", c.Email)
	}
	if displayCompanyPhoneNumber {
		companyStr += fmt.Sprintf("\n%s", c.PhoneNumber)
	}

	companyStr += fmt.Sprintf("\nSIRET: %s", c.Siret)

	return companyStr
}

func sumArrayWithoutDesignation(array []float64) float64 {
	result := 0.0
	for i := 1; i < len(array); i++ {
		result += array[i]
	}
	return result
}

func roundTwoDecimals(num float64) float64 {
	ratio := math.Pow(10, float64(2))
	return math.Round(num*ratio) / ratio
}

func addHeaders(pdf gofpdf.Pdf, rgba color.RGBA, cols []float64) {
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	pageSize := pdf.GetPageSizeStr("A4")
	currentR, currentG, currentB := pdf.GetFillColor()
	pdf.SetFillColor(int(rgba.R), int(rgba.G), int(rgba.B))
	pdf.SetFont(fontFamily, "B", fontSize)
	pdf.SetX(marginL)
	pdf.SetLineWidth(0.3)
	pdf.CellFormat(cols[0], 10, tr(DESIGNATION_TITLE), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[1], 10, tr(QUANTITY_TITLE), "1", 0, "C", true, 0, "")
	pdf.CellFormat(cols[2], 10, tr(PRICE_HT_TITLE), "1", 0, "C", true, 0, "")
	// Differ when quote has VAT so cols has a length of 5 instead of 4
	if len(cols) > 4 {
		pdf.CellFormat(cols[3], 10, tr(PRICE_TTC_TITLE), "1", 0, "C", true, 0, "")
		pdf.CellFormat(cols[4], 10, tr(SUBTOTALTTC_TITLE), "1", 0, "C", true, 0, "")
	} else {
		pdf.CellFormat(cols[3], 10, tr(SUBTOTALHT_TITLE), "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)
	pdf.SetFillColor(currentR, currentG, currentB)
	pdf.Line(marginL, pdf.GetY(), pageSize.Wd-marginL, pdf.GetY())
}

func addTotal(pdf gofpdf.Pdf, reportTotal float64, cols []float64) {
	tr := pdf.UnicodeTranslatorFromDescriptor("")
	_, height := pdf.GetPageSize()
	pdf.SetY(height - float64(marginB) - fontSize)
	pdf.SetFont(fontFamily, "B", fontSize)
	pdf.SetX(marginL + cols[0] + cols[1] + cols[2] - float64(reportTotalCellWidth))
	if len(cols) > 4 {
		pdf.CellFormat(float64(reportTotalCellWidth), 10, tr(REPORTED_TOTALTTC_TITLE), "1", 0, "C", true, 0, "")
	} else {
		pdf.CellFormat(float64(reportTotalCellWidth), 10, tr(REPORTED_TOTALHT_TITLE), "1", 0, "C", true, 0, "")
	}
	pdf.CellFormat(cols[3], 10, tr(fmt.Sprintf("%.2f€", reportTotal)), "1", 0, "C", false, 0, "")
	pdf.SetFont(fontFamily, "", fontSize)
}

func getLinePrice(price float64, quantity float64, tva float64) float64 {
	return quantity * getTTCPrice(price, tva)
}

func getTTCPrice(price float64, tva float64) float64 {
	return price * (1 + tva)
}
