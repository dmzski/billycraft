package company

import (
	"back/config"
	"back/internal/api/billCustomization"
	"back/internal/api/quoteCustomization"
	"back/internal/api/users"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(group fiber.Router) {
	router := group.Group("/company")
	router.Get("/mine", findMine)
	router.Patch("/mine", updateMine)
	router.Post("/", create)
	router.Post("/upload-logo", uploadLogo)
}

func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(DAO.FindOneById(*user.CompanyID).ToDTO())
}

func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID != nil {
		return fiber.NewError(fiber.StatusConflict, "You already have a company")
	}
	newCompany := dtos.CompanyRequest{}
  err := c.BodyParser(&newCompany)
  if err != nil {
    return fiber.NewError(fiber.StatusBadRequest, "Malformed company")
  }
	company := DAO.Create(user.Email, newCompany)
  users.DAO.JoinCompany(user.Email, company.ID)

	quoteCustomization.DAO.Create(company.ID, dtos.QuoteCustomization{})
	billCustomization.DAO.Create(company.ID, dtos.BillCustomization{})

  if (company.ID == "") {
		return fiber.NewError(fiber.StatusInternalServerError, "Company creation error")
  }
	user.CompanyID = &company.ID
	return c.JSON(company)
}

func updateMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
  company := DAO.FindOneById(*user.CompanyID)
	newCompany := dtos.CompanyRequest{}
  err := c.BodyParser(&newCompany)
  if err != nil {
    return fiber.NewError(fiber.StatusBadRequest, "Can't parse company")
  }
	if user.Email != company.CreatedBy {
		return fiber.NewError(fiber.StatusUnauthorized, "You cant do this")
	}

	company = DAO.Update(*user.CompanyID, newCompany)
	return c.JSON(company.ToDTO())
}

func uploadLogo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	company := DAO.FindOneById(*user.CompanyID)
	file, err := c.FormFile("logo")
	if company.CreatedBy != user.Email {
		return fiber.NewError(fiber.StatusUnauthorized, "You cant do this")
	}
	if err != nil {
		return c.Status(500).SendString("Error when getting logo file")
	}
	err = os.MkdirAll(config.Get().UploadDir+fmt.Sprintf("/%s/", company.ID), os.ModePerm)
	if err != nil {
		return c.Status(500).SendString("Error when creating directory : " + err.Error())
	}
	err = c.SaveFile(file, config.Get().UploadDir+fmt.Sprintf("/%s/logo.png", company.ID))
	if err != nil {
		return c.Status(500).SendString("Error when saving logo file : " + err.Error())
	}
	newPath := fmt.Sprintf("%s/api/logo/%s", c.BaseURL(), company.ID)
	company = DAO.Update(company.ID, dtos.CompanyRequest{
		Logo: &newPath,
	})
	return c.SendString(newPath)
}
