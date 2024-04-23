package customers

import (
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/customers")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var res []models.Customer
	q := c.Query("name_contains")
	if q != "" {
		res = DAO.FindAllByTenantAndNameContains(*user.CompanyID, q)
	} else {
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
	newCustomer := dtos.Customer{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newCustomer); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, newCustomer).ToDTO())
	}
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, *user.CompanyID)
		return c.Status(204).SendString("Customer deleted")
	}
}
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newCustomer := dtos.Customer{}
	if err := c.BodyParser(&newCustomer); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, newCustomer).ToDTO())
}

func makeArrayResponse(c *fiber.Ctx, array []models.Customer) error {
	res := make([]dtos.Customer, 0)
	for _, x := range array {
		newDto := x.ToDTO()
		res = append(res, newDto)
	}

	return c.JSON(res)
}
