package bills

import (
	"backv2/dtos"
	"backv2/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/bills")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var res []models.Bill
	filter := c.Query("filter")
	switch filter {
	case "not_archived":
		res = DAO.FindAllByTenantByStatusIsNot(*user.CompanyID, "ARCHIVED")
	case "archived":
		res = DAO.FindAllByTenantByStatusIs(*user.CompanyID, "ARCHIVED")
	default:
		res = DAO.FindAllByTenant(*user.CompanyID)
	}
	return makeArrayResponse(c, res)
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
	newBill := dtos.Bill{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newBill); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, newBill).ToDTO())
	}
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("Bill deleted")
	}
}
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBill := dtos.Bill{}
	if err := c.BodyParser(&newBill); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, newBill).ToDTO())
}

func makeArrayResponse(c *fiber.Ctx, array []models.Bill) error {
	res := make([]dtos.Bill, 0)
	for _, x := range array {
		newDto := x.ToDTO()
		res = append(res, newDto)
	}

	return c.JSON(res)
}
