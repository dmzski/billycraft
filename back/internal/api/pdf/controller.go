package pdf

import (
	"back/config"
	"back/internal/api/bills"
	"back/internal/api/quotes"
	"back/internal/lib/helpers"
	"back/internal/lib/models"
	"back/internal/lib/requests"
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
// @Summary Retrieves or generates a quote PDF
// @Tags PDFs
// @Param id path string true "Quote ID"
// @Success 200 {file} string "Quote PDF file"
// @Failure 400 {object} string "Invalid ID"
// @Failure 500 {object} string "File generation or retrieval error"
// @Router /pdfs/quote/{id} [get]
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
// @Summary Retrieves or generates a bill PDF
// @Tags PDFs
// @Param id path string true "Bill ID"
// @Success 200 {file} string "Bill PDF file"
// @Failure 400 {object} string "Invalid ID"
// @Failure 500 {object} string "File generation or retrieval error"
// @Router /pdfs/bill/{id} [get]
func getOrGenerateBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		bill := bills.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		// If the bill is a draft, generate a new PDF
		if bill.Status == "" || bill.Status == "DRAFT" {
			file := generateBillPDF(bill)
			return c.SendFile(file.Name())
		}

		// If the bill exists as a PDF, return the existing file
		file, err := os.Open(fmt.Sprintf("%s/%s/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			file := generateBillPDF(bill)
			return c.SendFile(file.Name())
		}
		return c.Download(file.Name())
	}
}

// getOrGenerateBills retrieves or generates multiple PDF bills and packages them into a ZIP file
// @Summary Retrieves or generates multiple bill PDFs
// @Tags PDFs
// @Param bills body requests.MultipleBillPdfRequest true "Bill IDs"
// @Success 200 {file} string "ZIP file containing multiple bill PDFs"
// @Failure 400 {object} string "Malformed body"
// @Failure 500 {object} string "File generation or ZIP creation error"
// @Router /pdfs/multiple/bill [post]
func getOrGenerateBills(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	request := requests.MultipleBillPdfRequest{}
	if err := c.BodyParser(&request); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}
	files := make([]*os.File, 0)
	// Generate or retrieve PDF for each bill
	for _, billId := range request.BillIds {
		bill := bills.DAO.FindOneByIdAndTenant(billId, *user.CompanyID)
		if bill.Status == "" || bill.Status == "DRAFT" {
			tempFile := generateBillPDF(bill)
			files = append(files, tempFile)
			_, err := tempFile.Seek(0, 0)
			if err != nil {
				return fiber.NewError(500, "Cant set index of new file to start")
			}
			defer tempFile.Close()
		}

		// If the bill exists as a PDF, add it to the list of files
		file, err := os.Open(fmt.Sprintf("%s/%s/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
		if err != nil {
			file := generateBillPDF(bill)
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

// getOrGenerateQuotes retrieves or generates multiple PDF quotes and packages them into a ZIP file
// @Summary Retrieves or generates multiple quote PDFs
// @Tags PDFs
// @Param quotes body requests.MultipleQuotePdfRequest true "Quote IDs"
// @Success 200 {file} string "ZIP file containing multiple quote PDFs"
// @Failure 400 {object} string "Malformed body"
// @Failure 500 {object} string "File generation or ZIP creation error"
// @Router /pdfs/multiple/quotes [post]
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

