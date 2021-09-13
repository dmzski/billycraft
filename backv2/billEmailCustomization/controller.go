package billEmailCustomization

import (
	"backv2/dtos"
	"backv2/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/bill-email-customization")
	router.Get("/", findAll)
	router.Get("/mine", findMine)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []dtos.BillEmailCustomization
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := x.ToDTO()
		dtos = append(dtos, newDto)
	}
	return c.JSON(dtos)
}
func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil {
		return fiber.NewError(fiber.StatusConflict, "No compagny")
	} else {
		return c.JSON(DAO.FindFirstByTenant(*user.CompanyID).ToDTO())
	}
}
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.FindOneByIdAndTenant(id, *user.CompanyID).ToDTO())
	}
}
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBillEmailCustomization := dtos.BillEmailCustomization{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newBillEmailCustomization); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, newBillEmailCustomization).ToDTO())
	}
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("BillEmailCustomization deleted")
	}
}
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBillEmailCustomization := dtos.BillEmailCustomization{}
	if err := c.BodyParser(&newBillEmailCustomization); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, newBillEmailCustomization).ToDTO())
}
