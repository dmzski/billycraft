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

// InitRoutes initializes the product groups routes
func InitRoutes(api fiber.Router) {
	router := api.Group("/product-groups")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumAdmin), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumAdmin), delete)
}

// findAll retrieves all product groups for a tenant
//	@Summary	Retrieves all product groups
//	@Tags		Product Groups
//	@Produce	json
//	@Success	200	{array}		responses.ProductGroupResponse	"List of product groups"
//	@Failure	500	{object}	string							"Error retrieving product groups"
//	@Router		/product-groups [get]
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

// findById retrieves a specific product group by ID
//	@Summary	Retrieves a specific product group by ID
//	@Tags		Product Groups
//	@Produce	json
//	@Param		id	path		string							true	"Product Group ID"
//	@Success	200	{object}	responses.ProductGroupResponse	"Product group"
//	@Failure	400	{object}	string							"Invalid ID"
//	@Failure	404	{object}	string							"Product group not found"
//	@Router		/product-groups/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateProductGroupResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing product group
//	@Summary	Updates a product group
//	@Tags		Product Groups
//	@Accept		json
//	@Produce	json
//	@Param		id		path		string								true	"Product Group ID"
//	@Param		body	body		requests.ProductGroupUpdateRequest	true	"Product group data"
//	@Success	200		{object}	responses.ProductGroupResponse		"Updated product group"
//	@Failure	400		{object}	string								"Invalid input or ID"
//	@Failure	404		{object}	string								"Product group not found"
//	@Router		/product-groups/{id} [patch]
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

// delete removes a product group by ID
//	@Summary	Deletes a product group
//	@Tags		Product Groups
//	@Param		id	path		string	true	"Product Group ID"
//	@Success	204	{string}	string	"Product group deleted"
//	@Failure	400	{object}	string	"Invalid ID"
//	@Failure	404	{object}	string	"Product group not found"
//	@Router		/product-groups/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, *user.CompanyID)
		return c.Status(204).SendString("Product deleted")
	}
}

// create adds a new product group
//	@Summary	Creates a new product group
//	@Tags		Product Groups
//	@Accept		json
//	@Produce	json
//	@Param		body	body		requests.ProductGroupCreateRequest	true	"Product group data"
//	@Success	201		{object}	responses.ProductGroupResponse		"Created product group"
//	@Failure	400		{object}	string								"Invalid input"
//	@Router		/product-groups [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newProduct := requests.ProductGroupCreateRequest{}
	if err := c.BodyParser(&newProduct); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateProductGroupResponse(DAO.Create(user, newProduct)))
}
