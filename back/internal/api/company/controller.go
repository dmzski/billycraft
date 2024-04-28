package company

import (
	"back/config"
	"back/internal/api/billCustomization"
	"back/internal/api/quoteCustomization"
	"back/internal/lib/auth"
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(group fiber.Router) {
	router := group.Group("/company")
	router.Get("/mine", findMine)
	router.Patch("/mine", auth.RoleRequired(enums.RoleEnumOwner), updateMine)
	router.Post("/", create)
	router.Post("/upload-logo", auth.RoleRequired(enums.RoleEnumOwner), uploadLogo)
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

	quoteCustomization.DAO.Create(company.ID, dtos.QuoteCustomization{})
	billCustomization.DAO.Create(company.ID, dtos.BillCustomization{})

	if company.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Company creation error")
	}
	user.CompanyID = &company.ID
	return c.JSON(company)
}

func updateMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newCompany := dtos.CompanyRequest{}
	err := c.BodyParser(&newCompany)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Can't parse company")
	}
	company := DAO.Update(*user.CompanyID, newCompany)
	return c.JSON(company.ToDTO())
}

func uploadLogo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	company := DAO.FindOneById(*user.CompanyID)
	file, err := c.FormFile("logo")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error when getting logo file")
	}
	err = os.MkdirAll(config.Get().UploadDir+fmt.Sprintf("/%s/", company.ID), os.ModePerm)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error when creating directory : " + err.Error())
	}
	err = c.SaveFile(file, config.Get().UploadDir+fmt.Sprintf("/%s/logo.png", company.ID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error when saving logo file : " + err.Error())
	}
	newPath := fmt.Sprintf("%s/api/logo/%s", c.BaseURL(), company.ID)
	company = DAO.Update(company.ID, dtos.CompanyRequest{
		Logo: &newPath,
	})
	return c.SendString(newPath)
}
