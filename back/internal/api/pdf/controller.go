package pdf

import (
	"back/config"
	"back/internal/api/bills"
	"back/internal/api/quotes"
	"back/internal/lib/models"
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
	r.Get("/report/generate", generateBill)
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

		file, err := os.Open(fmt.Sprintf("%s/%d/quotes/%s.pdf", config.Get().UploadDir, quote.CompanyID, quote.ID))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			return generateQuote(c)
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
			return generateBill(c)
		}

		file, err := os.Open(fmt.Sprintf("%s/%d/bills/%s.pdf", config.Get().UploadDir, bill.CompanyID, bill.ID))
		if err != nil {
			log.Println("Error when opening the file, err " + err.Error())
			return generateBill(c)
		}
		return c.Download(file.Name())
	}
}

func generateQuote(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		quote := quotes.DAO.FindOneByIdAndTenant(id, *user.CompanyID)

		file := generateQuotePDF(quote)

		return c.Download(file.Name())
	}
}

func generateBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		bill := bills.DAO.FindOneByIdAndTenant(id, *user.CompanyID)

		file := generateBillPDF(bill)

		return c.SendFile(file.Name())
	}
}
