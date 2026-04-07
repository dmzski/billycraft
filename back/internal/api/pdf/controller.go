package pdf

import (
	"back/config"
	"back/internal/api/bills"
	"back/internal/api/company"
	"back/internal/api/customers"
	"back/internal/api/quotes"
	"back/internal/lib/helpers"
	"back/internal/lib/helpers/facturx"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"bytes"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the PDF-related routes
func InitRoutes(api fiber.Router) {
	r := api.Group("/pdfs")
	r.Get("/quote/:id", getOrGenerateQuote)
	r.Get("/bill/:id", getOrGenerateBill)
	r.Post("/multiple/bill", getOrGenerateBills)
	r.Post("/multiple/quotes", getOrGenerateQuotes)
}

// getOrGenerateQuote retrieves or generates a PDF quote based on the status
//
//	@Summary	Retrieves or generates a quote PDF
//	@Tags		PDFs
//	@Produce	application/octet-stream
//	@Param		id	path		string	true	"Quote ID"
//	@Success	200	{object}	string	"Quote PDF file"
//	@Failure	400	{object}	string	"Invalid ID"
//	@Failure	500	{object}	string	"File generation or retrieval error"
//	@Router		/pdfs/quote/{id} [get]
func getOrGenerateQuote(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		quote := quotes.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		// If the quote is a draft, generate a new PDF
		if quote.Status == "" || quote.Status == "DRAFT" {
			file := generateQuotePDF(quote)
			return c.SendFile(file.Name())
		}

		// If the quote exists as a PDF, return the existing file
		file, err := os.Open(fmt.Sprintf("%s/%s/quotes/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.Name))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			file := generateQuotePDF(quote)
			return c.SendFile(file.Name())
		}
		return c.Download(file.Name())
	}
}

// getOrGenerateBill retrieves or generates a PDF bill based on the status
//
//	@Summary	Retrieves or generates a bill PDF
//	@Tags		PDFs
//	@Produce	application/octet-stream
//	@Param		id		path		string	true	"Bill ID"
//	@Param		format	query		string	false	"Export format (pdf or factur-x)"
//	@Success	200		{object}	string	"Bill PDF file"
//	@Failure	400		{object}	string	"Invalid ID"
//	@Failure	500		{object}	string	"File generation or retrieval error"
//	@Router		/pdfs/bill/{id} [get]
func getOrGenerateBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		format := c.Query("format", "pdf")
		bill := bills.DAO.FindOneByIdAndTenant(id, *user.CompanyID)

		var pdfData []byte
		var pdfFile *os.File
		var err error

		if bill.Status == "" || bill.Status == "DRAFT" {
			pdfFile = generateBillPDF(bill)
			defer pdfFile.Close()
			pdfData, err = os.ReadFile(pdfFile.Name())
			if err != nil {
				log.Println("Error reading generated PDF for bill", bill.Name, ":", err.Error())
				return fiber.NewError(500, "Error reading generated PDF")
			}
		} else {
			pdfFile, err = os.Open(fmt.Sprintf("%s/%s/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
			if err != nil {
				log.Println("Error when opening the file, err " + err.Error())
				pdfFile = generateBillPDF(bill)
				defer pdfFile.Close()
				pdfData, err = os.ReadFile(pdfFile.Name())
				if err != nil {
					log.Println("Error reading generated PDF for bill", bill.Name, ":", err.Error())
					return fiber.NewError(500, "Error reading generated PDF")
				}
			} else {
				pdfData, err = os.ReadFile(pdfFile.Name())
				pdfFile.Close()
				if err != nil {
					log.Println("Error reading existing PDF for bill", bill.Name, ":", err.Error())
					return fiber.NewError(500, "Error reading PDF")
				}
			}
		}

		if format == "factur-x" {
			return generateFacturXBill(c, bill, pdfData)
		}

		c.Set("Content-Type", "application/pdf")
		c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s.pdf\"", bill.Name))
		return c.Send(pdfData)
	}
}

func generateFacturXBill(c *fiber.Ctx, bill models.Bill, pdfData []byte) error {
	company := company.DAO.FindOneById(bill.CompanyID)
	var customer *models.Customer
	if bill.CustomerID != nil {
		cust := customers.DAO.FindOneByIdAndTenant(*bill.CustomerID, bill.CompanyID)
		customer = &cust
	}

	if len(pdfData) == 0 {
		log.Println("Error: Original PDF is empty for bill", bill.Name)
		return fiber.NewError(500, "Generated PDF is empty")
	}

	if !bytes.HasPrefix(pdfData, []byte("%PDF-")) {
		log.Println("Error: Generated PDF is not valid for bill", bill.Name)
		return fiber.NewError(500, "Generated PDF is not a valid PDF file")
	}

	log.Printf("Original PDF size for bill %s: %d bytes", bill.Name, len(pdfData))

	facturXData := facturx.PrepareFacturXData(bill, company, customer)
	xmlContent, err := facturx.GenerateXML(facturXData)
	if err != nil {
		log.Println("Error generating Factur-X XML:", err.Error())
		return fiber.NewError(500, "Error generating Factur-X XML")
	}

	log.Printf("Factur-X XML generated for bill %s, size: %d bytes", bill.Name, len(xmlContent))

	resultPDF, err := facturx.EmbedFacturXXMLFromBuffer(pdfData, xmlContent)
	if err != nil {
		log.Println("Error embedding XML with pdfcpu:", err.Error())
		return fiber.NewError(500, "Error embedding XML in PDF: "+err.Error())
	}

	log.Printf("Factur-X PDF generated for bill %s, size: %d bytes", bill.Name, len(resultPDF))

	if len(resultPDF) == 0 {
		log.Println("Error: Resulting PDF is empty after embedding XML for bill", bill.Name)
		return fiber.NewError(500, "Resulting PDF is empty after embedding XML")
	}

	if !bytes.HasPrefix(resultPDF, []byte("%PDF-")) {
		log.Println("Error: Resulting PDF is not valid after embedding XML for bill", bill.Name)
		return fiber.NewError(500, "Resulting PDF is not valid after embedding XML")
	}

	c.Set("Content-Type", "application/pdf")
	c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s_factur-x.pdf\"", bill.Name))
	return c.Send(resultPDF)
}

// getOrGenerateBills retrieves or generates multiple PDF bills and packages them into a ZIP file
//
//		@Summary	Retrieves or generates multiple bill PDFs
//		@Tags		PDFs
//	 @Accept json
//		@Produce	application/octet-stream
//		@Param		bills	body		requests.MultipleBillPdfRequest	true	"Bill IDs"
//		@Param		format	query		string							false	"Export format (pdf or factur-x)"
//		@Success	200		{string}	string							"ZIP file containing multiple bill PDFs"
//		@Failure	400		{string}	string							"Malformed body"
//		@Failure	500		{string}	string							"File generation or ZIP creation error"
//		@Router		/pdfs/multiple/bill [post]
func getOrGenerateBills(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	request := requests.MultipleBillPdfRequest{}
	if err := c.BodyParser(&request); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	format := c.Query("format", "pdf")
	files := make([]*os.File, 0)

	for _, billId := range request.BillIds {
		bill := bills.DAO.FindOneByIdAndTenant(billId, *user.CompanyID)

		var pdfData []byte
		var pdfFile *os.File
		var err error

		if bill.Status == "" || bill.Status == "DRAFT" {
			pdfFile = generateBillPDF(bill)
			defer pdfFile.Close()
			pdfData, err = os.ReadFile(pdfFile.Name())
			if err != nil {
				log.Println("Error reading generated PDF for bill", bill.Name, ":", err.Error())
				continue
			}
		} else {
			pdfFile, err = os.Open(fmt.Sprintf("%s/%s/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
			if err != nil {
				log.Println("Error when opening the file, err " + err.Error())
				pdfFile = generateBillPDF(bill)
				defer pdfFile.Close()
				pdfData, err = os.ReadFile(pdfFile.Name())
				if err != nil {
					log.Println("Error reading generated PDF for bill", bill.Name, ":", err.Error())
					continue
				}
			} else {
				pdfData, err = os.ReadFile(pdfFile.Name())
				pdfFile.Close()
				if err != nil {
					log.Println("Error reading existing PDF for bill", bill.Name, ":", err.Error())
					continue
				}
			}
		}

		if format == "factur-x" {
			facturXFile, err := generateFacturXBillFile(bill, pdfData)
			if err != nil {
				log.Println("Error generating Factur-X for bill", billId, ":", err.Error())
				continue
			}
			defer facturXFile.Close()
			files = append(files, facturXFile)
		} else {
			tmpFile, err := os.CreateTemp("", fmt.Sprintf("bill_%s_*.pdf", bill.Name))
			if err != nil {
				log.Println("Error creating temp file for bill", bill.Name, ":", err.Error())
				continue
			}
			_, err = tmpFile.Write(pdfData)
			if err != nil {
				tmpFile.Close()
				log.Println("Error writing temp file for bill", bill.Name, ":", err.Error())
				continue
			}
			defer tmpFile.Close()
			files = append(files, tmpFile)
		}
	}

	zip, err := helpers.CreateZipFromFiles(files)
	if err != nil {
		log.Println("Error when generating zip file", err.Error())
		return fiber.NewError(500, "Error when generating zip file")
	}

	defer zip.Close()

	return c.Download(zip.Name())
}

func generateFacturXBillFile(bill models.Bill, pdfData []byte) (*os.File, error) {
	company := company.DAO.FindOneById(bill.CompanyID)
	var customer *models.Customer
	if bill.CustomerID != nil {
		cust := customers.DAO.FindOneByIdAndTenant(*bill.CustomerID, bill.CompanyID)
		customer = &cust
	}

	if len(pdfData) == 0 {
		return nil, fmt.Errorf("original PDF is empty for bill %s", bill.Name)
	}

	if !bytes.HasPrefix(pdfData, []byte("%PDF-")) {
		return nil, fmt.Errorf("generated PDF is not valid for bill %s", bill.Name)
	}

	log.Printf("Original PDF size for bill %s: %d bytes", bill.Name, len(pdfData))

	facturXData := facturx.PrepareFacturXData(bill, company, customer)
	xmlContent, err := facturx.GenerateXML(facturXData)
	if err != nil {
		return nil, fmt.Errorf("error generating Factur-X XML: %w", err)
	}

	log.Printf("Factur-X XML generated for bill %s, size: %d bytes", bill.Name, len(xmlContent))

	resultPDF, err := facturx.EmbedFacturXXMLFromBuffer(pdfData, xmlContent)
	if err != nil {
		return nil, fmt.Errorf("error embedding XML in PDF: %w", err)
	}

	log.Printf("Factur-X PDF generated for bill %s, size: %d bytes", bill.Name, len(resultPDF))

	if len(resultPDF) == 0 {
		return nil, fmt.Errorf("resulting PDF is empty after embedding XML for bill %s", bill.Name)
	}

	if !bytes.HasPrefix(resultPDF, []byte("%PDF-")) {
		return nil, fmt.Errorf("resulting PDF is not valid after embedding XML for bill %s", bill.Name)
	}

	tmpFile, err := os.CreateTemp("", fmt.Sprintf("facturx_%s_*.pdf", bill.Name))
	if err != nil {
		return nil, err
	}

	_, err = tmpFile.Write(resultPDF)
	if err != nil {
		tmpFile.Close()
		return nil, err
	}

	return tmpFile, nil
}

//

// getOrGenerateQuotes retrieves or generates multiple PDF quotes and packages them into a ZIP file
//
//		@Summary	Retrieves or generates multiple quote PDFs
//	 @Accept json
//		@Produce	application/octet-stream
//		@Tags		PDFs
//		@Param		quotes	body		requests.MultipleQuotePdfRequest	true	"Quote IDs"
//		@Success	200		{object}	string								"ZIP file containing multiple quote PDFs"
//		@Failure	400		{object}	string								"Malformed body"
//		@Failure	500		{object}	string								"File generation or ZIP creation error"
//		@Router		/pdfs/multiple/quotes [post]
func getOrGenerateQuotes(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	request := requests.MultipleQuotePdfRequest{}
	if err := c.BodyParser(&request); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}
	files := make([]*os.File, 0)
	// Generate or retrieve PDF for each quote
	for _, quoteId := range request.QuoteIds {
		quote := quotes.DAO.FindOneByIdAndTenant(quoteId, *user.CompanyID)
		if quote.Status == "" || quote.Status == "DRAFT" {
			tempFile := generateQuotePDF(quote)
			files = append(files, tempFile)
			_, err := tempFile.Seek(0, 0)
			if err != nil {
				return fiber.NewError(500, "Cant set index of new file to start")
			}
			defer tempFile.Close()
		}

		// If the quote exists as a PDF, add it to the list of files
		file, err := os.Open(fmt.Sprintf("%s/%s/bills/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.Name))
		if err != nil {
			file := generateQuotePDF(quote)
			_, err = file.Seek(0, 0)
			if err != nil {
				return fiber.NewError(500, "Cant set index of existing file to start")
			}
			defer file.Close()
		}
		files = append(files, file)
	}

	// Create a ZIP file from the generated PDFs
	zip, err := helpers.CreateZipFromFiles(files)
	if err != nil {
		log.Println("Error when generating zip file", err.Error())
		return fiber.NewError(500, "Error when generating zip file")
	}

	defer zip.Close()

	return c.Download(zip.Name())
}
