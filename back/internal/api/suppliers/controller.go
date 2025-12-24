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

// InitRoutes initializes the routes for supplier management
func InitRoutes(api fiber.Router) {
	router := api.Group("/suppliers")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumAdmin), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumAdmin), delete)
}

// findAll retrieves all suppliers for a tenant
//	@Summary	Retrieves all suppliers for a tenant
//	@Tags		Suppliers
//	@Produce	json
//	@Success	200	{array}		responses.SupplierResponse	"List of all suppliers"
//	@Failure	404	{object}	string						"No suppliers found"
//	@Router		/suppliers [get]
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

// findById retrieves a specific supplier by ID
//	@Summary	Retrieves a supplier by ID
//	@Tags		Suppliers
//	@Produce	json
//	@Param		id	path		string						true	"Supplier ID"
//	@Success	200	{object}	responses.SupplierResponse	"Supplier details"
//	@Failure	400	{object}	string						"Invalid ID"
//	@Failure	404	{object}	string						"Supplier not found"
//	@Router		/suppliers/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateSupplierResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing supplier
//	@Summary	Modifies an existing supplier
//	@Tags		Suppliers
//	@Accept		json
//	@Produce	json
//	@Param		id		path		string						true	"Supplier ID"
//	@Param		body	body		requests.SupplierRequest	true	"Supplier update data"
//	@Success	200		{object}	responses.SupplierResponse	"Updated supplier details"
//	@Failure	400		{object}	string						"Invalid input data"
//	@Failure	404		{object}	string						"Supplier not found"
//	@Router		/suppliers/{id} [patch]
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

// delete removes a supplier by ID
//	@Summary	Deletes a supplier by ID
//	@Tags		Suppliers
//	@Produce	json
//	@Param		id	path		string	true	"Supplier ID"
//	@Success	204	{string}	string	"Supplier deleted"
//	@Failure	400	{object}	string	"Invalid ID"
//	@Failure	404	{object}	string	"Supplier not found"
//	@Router		/suppliers/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, *user.CompanyID)
		return c.Status(204).SendString("Product deleted")
	}
}

// create generates a new supplier
//	@Summary	Creates a new supplier
//	@Tags		Suppliers
//	@Accept		json
//	@Produce	json
//	@Param		body	body		requests.SupplierRequest	true	"Supplier creation data"
//	@Success	201		{object}	responses.SupplierResponse	"Created supplier details"
//	@Failure	400		{object}	string						"Invalid input data"
//	@Router		/suppliers [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newSupplier := requests.SupplierRequest{}
	if err := c.BodyParser(&newSupplier); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateSupplierResponse(DAO.Create(user, newSupplier)))
}
