package suppliers

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/suppliers")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumAdmin), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumAdmin), delete)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.SupplierResponse
	for _, supplier := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateSupplierResponse(supplier)
		dtos = append(dtos, newDto)
	}
	if len(dtos) == 0 {
		return c.JSON(make([]string, 0))
	}
	return c.JSON(dtos)
}
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateSupplierResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newSupplier := requests.SupplierRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newSupplier); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateSupplierResponse(DAO.Update(id, *user.CompanyID, newSupplier)))
	}
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, *user.CompanyID)
		return c.Status(204).SendString("Product deleted")
	}
}
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newSupplier := requests.SupplierRequest{}
	if err := c.BodyParser(&newSupplier); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateSupplierResponse(DAO.Create(user, newSupplier)))
}
