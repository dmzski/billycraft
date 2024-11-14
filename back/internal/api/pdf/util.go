package pdf

import (
	"math"
)

var (
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
	HTML_TO_PDF_PATH        = "/forms/chromium/convert/html"
)

func roundTwoDecimals(num float64) float64 {
	ratio := math.Pow(10, float64(2))
	return math.Round(num*ratio) / ratio
}

func getLinePrice(price float64, quantity float64, tva float32) float64 {
	return roundTwoDecimals(quantity * getTTCPrice(price, tva))
}

func getTTCPrice(price float64, tva float32) float64 {
	return roundTwoDecimals(price * (1 + float64(tva)))
}
