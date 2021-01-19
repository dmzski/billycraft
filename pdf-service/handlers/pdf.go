package handlers

import (
	"coco-erp/pdf-service/database"
	"coco-erp/pdf-service/generators"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func SetupPDFRoutes(r fiber.Router) {
	r.Get("/quote/:id", getOrGenerateQuote)
	r.Get("/bill/:id", getOrGenerateBill)
	r.Get("/quote/:id/generate", generateQuotePDF)
	r.Get("/bill/:id/generate", generateBillPDF)
}

func getOrGenerateQuote(c *fiber.Ctx) error {
	q := database.FindQuote(c.Params("id"))
	if q == nil {
		return c.SendStatus(404)
	}
	file, err := os.Open("pdfs/" + fmt.Sprintf("%d", q.CompanyID) + "/quotes/" + q.ID + ".pdf")
	if err != nil {
		log.Println("Error when opening the file, err " + err.Error())
		return generateQuotePDF(c)
	}
	return c.SendFile(file.Name())
}

func getOrGenerateBill(c *fiber.Ctx) error {
	b := database.FindBill(c.Params("id"))
	if b == nil {
		return c.SendStatus(404)
	}
	file, err := os.Open("pdfs/" + fmt.Sprintf("%d", b.CompanyID) + "/bills/" + b.ID + ".pdf")
	if err != nil {
		return generateBillPDF(c)
	}
	return c.SendFile(file.Name())
}

func generateQuotePDF(c *fiber.Ctx) error {
	q := database.FindQuote(c.Params("id"))
	if q == nil {
		return c.SendStatus(404)
	}

	if q.FileName != "" && (q.Status != "DRAFT") {
		return c.SendStatus(403)
	}

	co := database.FindCompany(q.CompanyID)
	if c == nil {
		return c.SendStatus(404)
	}
	qc := database.FindQuoteCustomizationByCompanyID(co.ID)
	if qc == nil {
		return c.SendStatus(404)
	}

	file := generators.GenerateQuotePDF(q, co, qc)

	return c.SendFile(file.Name())
}

func generateBillPDF(c *fiber.Ctx) error {
	b := database.FindBill(c.Params("id"))
	if b == nil {
		return c.SendStatus(404)
	}

	if b.FileName != "" && (b.Status != "DRAFT") {
		return c.SendStatus(403)
	}

	co := database.FindCompany(b.CompanyID)
	if c == nil {
		return c.SendStatus(404)
	}
	bc := database.FindBillCustomizationByCompanyID(co.ID)
	if bc == nil {
		return c.SendStatus(404)
	}

	file := generators.GenerateBillPDF(b, co, bc)

	return c.SendFile(file.Name())
}
