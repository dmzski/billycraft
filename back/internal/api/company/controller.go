package company

import (
	"back/config"
	"back/internal/api/users"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"fmt"
	"log"
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
  log.Println(company)
  if (company.ID == 0) {
		return fiber.NewError(fiber.StatusInternalServerError, "Company creation error")
  }
	user.CompanyID = &company.ID
	users.DAO.JoinCompany(user.Email, company.ID)
	return c.JSON(company)
}

func updateMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newCompany := dtos.CompanyRequest{}
	c.BodyParser(&newCompany)
	if user.CompanyID == nil || user.Role != "ADMIN" {
		return fiber.NewError(fiber.StatusUnauthorized, "You cant do this")
	}

	company := DAO.Update(*user.CompanyID, newCompany)
	return c.JSON(company.ToDTO())
}

func uploadLogo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	company := DAO.FindOneById(*user.CompanyID)
	file, err := c.FormFile("logo")
	if user.Role != "ADMIN" {
		return fiber.NewError(fiber.StatusUnauthorized, "You cant do this")
	}
	if err != nil {
		return c.Status(500).SendString("Error when getting logo file")
	}
	err = os.MkdirAll(config.Get().UploadDir+fmt.Sprintf("/%d/", company.ID), os.ModePerm)
	if err != nil {
		return c.Status(500).SendString("Error when creating directory : " + err.Error())
	}
	err = c.SaveFile(file, config.Get().UploadDir+fmt.Sprintf("/%d/logo.png", company.ID))
	if err != nil {
		return c.Status(500).SendString("Error when saving logo file : " + err.Error())
	}
	newPath := fmt.Sprintf("%s/api/logo/%d", c.BaseURL(), company.ID)
	company = DAO.Update(company.ID, dtos.CompanyRequest{
		Logo: &newPath,
	})
	return c.SendString(newPath)
}
