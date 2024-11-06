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

func InitRoutes(api fiber.Router) {
	r := api.Group("/pdfs")
	r.Get("/quote/:id", getOrGenerateQuote)
	r.Get("/bill/:id", getOrGenerateBill)
	r.Post("/multiple/bill", getOrGenerateBills)
}

func getOrGenerateQuote(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		quote := quotes.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if quote.Status == "" || quote.Status == "DRAFT" {
			file := generateQuotePDF(quote)
			return c.SendFile(file.Name())
		}

		file, err := os.Open(fmt.Sprintf("%s/%s/quotes/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.Name))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			file := generateQuotePDF(quote)
			return c.SendFile(file.Name())
		}
		return c.Download(file.Name())
	}
}

func getOrGenerateBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		bill := bills.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if bill.Status == "" || bill.Status == "DRAFT" {
			file := generateBillPDF(bill)
			return c.SendFile(file.Name())
		}

		file, err := os.Open(fmt.Sprintf("%s/%s/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.Name))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			file := generateBillPDF(bill)
			return c.SendFile(file.Name())
		}
		return c.Download(file.Name())
	}
}

func getOrGenerateBills(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	request := requests.MultipleBillPdfRequest{}
	if err := c.BodyParser(&request); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}
	files := make([]*os.File, 0)
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

	zip, err := helpers.CreateZipFromFiles(files)
	if err != nil {
		log.Println("Error when generating zip file", err.Error())
		return fiber.NewError(500, "Error when generating zip file")
	}

	defer zip.Close()

	return c.Download(zip.Name())
}
