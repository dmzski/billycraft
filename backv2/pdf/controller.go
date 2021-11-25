package pdf

import (
	"backv2/bills"
	"backv2/config"
	"backv2/models"
	"backv2/quotes"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	r := api.Group("/pdfs")
	r.Get("/quote/:id", getOrGenerateQuote)
	r.Get("/bill/:id", getOrGenerateBill)
	r.Get("/quote/:id/generate", generateQuote)
	r.Get("/bill/:id/generate", generateBill)
}

func getOrGenerateQuote(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		quote := quotes.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if quote.Status == "" || quote.Status == "DRAFT" {
			return generateQuote(c)
		}

		file, err := os.Open(fmt.Sprintf("%s%d/quotes/%s.pdf", config.Get().PdfDir, quote.CompanyID, quote.ID))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			return c.Status(fiber.ErrInternalServerError.Code).SendString("An error occured")
		}
		return c.SendFile(file.Name())
	}
}

func getOrGenerateBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		bill := bills.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if bill.Status == "" || bill.Status == "DRAFT" {
			return generateBill(c)
		}

		file, err := os.Open(fmt.Sprintf("%s%d/bills/%s.pdf", config.Get().PdfDir, bill.CompanyID, bill.ID))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			return c.Status(fiber.ErrInternalServerError.Code).SendString("An error occured")
		}
		return c.SendFile(file.Name())
	}
}

func generateQuote(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		quote := quotes.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if quote.FileName != nil && (quote.Status != "DRAFT") {
			return c.SendStatus(403)
		}
		file := generateQuotePDF(quote)

		return c.SendFile(file.Name())
	}
}

func generateBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		bill := bills.DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if bill.FileName != nil && (bill.Status != "DRAFT") {
			return c.SendStatus(403)
		}
		file := generateBillPDF(bill)

		return c.SendFile(file.Name())
	}
}
