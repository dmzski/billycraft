package pdf

import (
	"back/config"
	"back/internal/api/company"
	"back/internal/api/customers"
	"back/internal/api/quoteCustomization"
	"back/internal/lib/models"
	"encoding/base64"
	"fmt"
	"html/template"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

type QuoteViewData struct {
	Quote              models.Quote
	Company            models.Company
	Title              string
	QuoteCustomization models.QuoteCustomization
	Customer           models.Customer
	LogoSrc            string
	GeneratedDate      string
	ReferenceTitle     string
	ObjectTitle        string
	DesignationTitle   string
	QuantityTitle      string
	EtPriceTitle       string
	ItPriceTitle       string
	SubTotalTitle      string
	HasVat             bool
	Currency           string
	ItTotalTitle       string
	EtTotalTitle       string
	VatTitle           string
	FreeStr            string
}

func (v QuoteViewData) IsFree(price float64) bool {
	return price == 0
}

func (v QuoteViewData) GetItPriceStr(price float64) string {
	vat := v.Quote.Tva
	if vat != nil {
		return fmt.Sprintf("%.2f %s", roundTwoDecimals(getTTCPrice(price, *vat/100)), v.Currency)
	}

	return fmt.Sprintf("%.2f %s", roundTwoDecimals(getTTCPrice(price, 0)), v.Currency)
}

func (v QuoteViewData) GetEtPriceStr(price float64) string {
	return fmt.Sprintf("%.2f %s", roundTwoDecimals(price), v.Currency)
}

func (v QuoteViewData) GetItLinePriceStr(price float64, quantity float64) string {
	vat := v.Quote.Tva
	if vat != nil {
		return fmt.Sprintf("%.2f %s", roundTwoDecimals(getLinePrice(price, quantity, *vat/100)), v.Currency)
	}

	return fmt.Sprintf("%.2f %s", roundTwoDecimals(getLinePrice(price, quantity, 0)), v.Currency)
}

func (v QuoteViewData) GetItTotalStr() string {
	return fmt.Sprintf("%.2f %s", getQuoteTotal(v.Quote), v.Currency)
}

func (v QuoteViewData) GetEtTotalStr() string {
	return fmt.Sprintf("%.2f %s", getQuoteTotalHT(v.Quote), v.Currency)
}

func (v QuoteViewData) GetVatTotalStr() string {
	quote := v.Quote
	total := getQuoteTotal(quote) - getQuoteTotalHT(quote)
	return fmt.Sprintf("%.2f %s", total, v.Currency)
}

func generateQuotePDF(quote models.Quote) *os.File {
	var FOLDER = QUOTES_FOLDER
	var TEMPLATE_PATH = "./templates/quote.html"
	var TITLE = QUOTE_TITLE

	date := time.Now()
	if quote.SentAt != nil {
		date = *quote.SentAt
	}
	company := company.DAO.FindOneById(quote.CompanyID)
	customization := quoteCustomization.DAO.FindFirstOrInitByTenant(quote.CompanyID)
	var customer models.Customer
	if quote.CustomerID != nil {
		customer = customers.DAO.FindOneByIdAndTenant(*quote.CustomerID, quote.CompanyID)
	}

	// Put the Logo
	logoSrc := ""
	if company.Logo != nil {
		logoSrc = *company.Logo
		if strings.Contains(*company.Logo, company.ID) {
			imgdata, err := os.ReadFile(config.Get().UploadDir + fmt.Sprintf("/%s/logo.png", company.ID))
			if err == nil {
				logoSrc = fmt.Sprintf("data:image/png;base64,%s", base64.StdEncoding.EncodeToString(imgdata))
			}
		}
	}

	vd := QuoteViewData{
		Quote:              quote,
		Company:            company,
		Title:              TITLE,
		QuoteCustomization: customization,
		Customer:           customer,
		LogoSrc:            logoSrc,
		GeneratedDate:      fmt.Sprintf("%s : %s", DATE_TITLE, date.Format("02/01/2006")),
		ReferenceTitle:     REFERENCE_TITLE,
		ObjectTitle:        OBJECT_TITLE,
		DesignationTitle:   DESIGNATION_TITLE,
		QuantityTitle:      QUANTITY_TITLE,
		EtPriceTitle:       PRICE_HT_TITLE,
		ItPriceTitle:       PRICE_TTC_TITLE,
		SubTotalTitle:      SUBTOTALTTC_TITLE,
		HasVat:             quote.Tva != nil && *quote.Tva > float32(0),
		Currency:           "€",
		VatTitle:           VAT_TITLE,
		EtTotalTitle:       TOTALHT_TITLE,
		ItTotalTitle:       TOTALTTC_TITLE,
		FreeStr:            FREE_STR,
	}

	footerData := map[string]interface{}{
		"Footer": customization.Footer,
	}

	tmpl, err := template.New("quote.html").Funcs(template.FuncMap{
		"htmlSafe": func(html string) template.URL {
			return template.URL(html)
		},
	}).ParseFiles(TEMPLATE_PATH)
	if err != nil {
		panic(err)
	}

	tmplFooter, err := template.New("footer.html").ParseFiles("./templates/footer.html")

	if err != nil {
		panic(err)
	}
	b := new(strings.Builder)
	bFooter := new(strings.Builder)
	err = tmpl.Execute(b, vd)
	if err != nil {
		panic(err)
	}
	err = tmplFooter.Execute(bFooter, footerData)
	if err != nil {
		panic(err)
	}

	agent := fiber.Post(fmt.Sprintf("%s%s", config.Get().PdfUrl, HTML_TO_PDF_PATH))
	index := &fiber.FormFile{
		Fieldname: "index.html",
		Name:      "index.html",
		Content:   []byte(b.String()),
	}
	footer := &fiber.FormFile{
		Fieldname: "footer.html",
		Name:      "footer.html",
		Content:   []byte(bFooter.String()),
	}
	agent.FileData(index).FileData(footer).MultipartForm(nil)

	statusCode, body, errs := agent.Bytes()
	if len(errs) > 0 || statusCode != 200 {
		panic(fmt.Sprintf("Cant get pdf from pdf service : %d, %s", statusCode, body))
	}
	// Create the final directory
	err = os.MkdirAll(fmt.Sprintf(FOLDER, config.Get().UploadDir, company.ID), os.ModePerm)
	if err != nil {
		panic(err)
	}

	// Save the pdf
	// Create the file
	f, err := os.Create(fmt.Sprintf(FOLDER+"/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.Name))
	if err != nil {
		panic(err)
	}
	_, err = f.Write(body)
	if err != nil {
		panic(err)
	}

	return f
}

func getQuoteTotal(quote models.Quote) float64 {
	total := 0.0
	tva := 0.0
	if quote.Tva != nil && *quote.Tva > 0 {
		tva = float64(*quote.Tva / 100)
	}
	for _, line := range quote.Lines {
		total += roundTwoDecimals(getLinePrice(line.Price, line.Quantity, float32(tva)))
	}
	return total
}

func getQuoteTotalHT(quote models.Quote) float64 {
	total := 0.0
	for _, line := range quote.Lines {
		total += roundTwoDecimals(getLinePrice(line.Price, line.Quantity, 0))
	}
	return total
}
