package product_groups

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
	router := api.Group("/product-groups")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumAdmin), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumAdmin), delete)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.ProductGroupResponse
	for _, productGroup := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateProductGroupResponse(productGroup)
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
		return c.JSON(responses.CreateProductGroupResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newProduct := requests.ProductGroupUpdateRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newProduct); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateProductGroupResponse(DAO.Update(id, *user.CompanyID, newProduct)))
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
	newProduct := requests.ProductGroupCreateRequest{}
	if err := c.BodyParser(&newProduct); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateProductGroupResponse(DAO.Create(user, newProduct)))
}
