package pdf

import (
	"back/config"
	"back/internal/api/billCustomization"
	"back/internal/api/company"
	"back/internal/api/customers"
	"back/internal/lib/models"
	"encoding/base64"
	"fmt"
	"html/template"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

type BillViewData struct {
	Bill              models.Bill
	Company           models.Company
	Title             string
	BillCustomization models.BillCustomization
	Customer          models.Customer
	LogoSrc           string
	GeneratedDate     string
	ReferenceTitle    string
	ObjectTitle       string
	DesignationTitle  string
	QuantityTitle     string
	EtPriceTitle      string
	ItPriceTitle      string
	SubTotalTitle     string
	HasVat            bool
	Currency          string
	ItTotalTitle      string
	EtTotalTitle      string
	VatTitle          string
}

func (v BillViewData) GetItPriceStr(price float64) string {
	vat := v.Bill.Tva
	if vat != nil {
		return fmt.Sprintf("%.2f %s", roundTwoDecimals(getTTCPrice(price, *vat/100)), v.Currency)
	}

	return fmt.Sprintf("%.2f %s", roundTwoDecimals(getTTCPrice(price, 0)), v.Currency)
}

func (v BillViewData) GetEtPriceStr(price float64) string {
	return fmt.Sprintf("%.2f %s", roundTwoDecimals(price), v.Currency)
}

func (v BillViewData) GetItLinePriceStr(price float64, quantity float64) string {
	vat := v.Bill.Tva
	if vat != nil {
		return fmt.Sprintf("%.2f %s", roundTwoDecimals(getLinePrice(price, quantity, *vat)), v.Currency)
	}

	return fmt.Sprintf("%.2f %s", roundTwoDecimals(getLinePrice(price, quantity, 0)), v.Currency)
}

func (v BillViewData) GetItTotalStr() string {
	return fmt.Sprintf("%.2f %s", getBillTotal(v.Bill), v.Currency)
}

func (v BillViewData) GetEtTotalStr() string {
	return fmt.Sprintf("%.2f %s", getBillTotalHT(v.Bill), v.Currency)
}

func (v BillViewData) GetVatTotalStr() string {
	bill := v.Bill
	total := getBillTotal(bill) - getBillTotalHT(bill)
	return fmt.Sprintf("%.2f %s", total, v.Currency)
}

func generateBillPDF(bill models.Bill) *os.File {
	var TEMPLATE_PATH = "./templates/bill.html"
	var TITLE = BILL_TITLE
	var FOLDER = BILLS_FOLDER

	date := time.Now()
	company := company.DAO.FindOneById(bill.CompanyID)
	customization := billCustomization.DAO.FindFirstOrInitByTenant(bill.CompanyID)
	var customer models.Customer
	if bill.CustomerID != nil {
		customer = customers.DAO.FindOneByIdAndTenant(*bill.CustomerID, bill.CompanyID)
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

	vd := BillViewData{
		Bill:              bill,
		Company:           company,
		Title:             TITLE,
		BillCustomization: customization,
		Customer:          customer,
		LogoSrc:           logoSrc,
		GeneratedDate:     fmt.Sprintf("%s : %s", DATE_TITLE, date.Format("02/01/2006")),
		ReferenceTitle:    REFERENCE_TITLE,
		ObjectTitle:       OBJECT_TITLE,
		DesignationTitle:  DESIGNATION_TITLE,
		QuantityTitle:     QUANTITY_TITLE,
		EtPriceTitle:      PRICE_HT_TITLE,
		ItPriceTitle:      PRICE_TTC_TITLE,
		SubTotalTitle:     SUBTOTALTTC_TITLE,
		HasVat:            bill.Tva != nil && *bill.Tva > float32(0),
		Currency:          "€",
		VatTitle:          VAT_TITLE,
		EtTotalTitle:      TOTALHT_TITLE,
		ItTotalTitle:      TOTALTTC_TITLE,
	}

  footerData := map[string]interface{}{
    "Footer": customization.Footer,
  }

	tmpl, err := template.New("bill.html").Funcs(template.FuncMap{
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
	agent.FileData(index, footer).MultipartForm(nil)

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
	f, err := os.Create(fmt.Sprintf(FOLDER+"/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
	if err != nil {
		panic(err)
	}
	_, err = f.Write(body)
	if err != nil {
		panic(err)
	}

	return f
}

func getBillTotal(bill models.Bill) float64 {
	total := 0.0
	tva := 0.0
	if bill.Tva != nil && *bill.Tva > 0 {
		tva = float64(*bill.Tva / 100)
	}
	for _, line := range bill.Lines {
		total += roundTwoDecimals(getLinePrice(line.Price, line.Quantity, float32(tva)))
	}
	return total
}

func getBillTotalHT(bill models.Bill) float64 {
	total := 0.0
	for _, line := range bill.Lines {
		total += roundTwoDecimals(getLinePrice(line.Price, line.Quantity, 0))
	}
	return total
}
