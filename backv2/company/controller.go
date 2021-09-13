package company

import (
	"backv2/dtos"
	"backv2/models"
	"backv2/users"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(group fiber.Router) {
	router := group.Group("/company")
	router.Get("/mine", findMine)
	router.Patch("/mine", updateMine)
	router.Post("/", create)
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
	newCompany := dtos.Company{}
	c.BodyParser(&newCompany)
	newCompany.CreatedBy = user.Email
	DAO.Create(newCompany)
	user.CompanyID = &newCompany.ID
	users.DAO.SaveUser(user)
	return c.JSON(newCompany)
}

func updateMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newCompany := dtos.Company{}
	c.BodyParser(&newCompany)
	dto := DAO.Update(*user.CompanyID, newCompany).ToDTO()
	user.CompanyID = &newCompany.ID
	users.DAO.SaveUser(user)
	return c.JSON(dto)
}
