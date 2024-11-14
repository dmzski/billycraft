package products

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the product routes
func InitRoutes(api fiber.Router) {
	router := api.Group("/products")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), create)
	router.Post("/update-stocks", auth.RoleRequired(enums.RoleEnumEditor), updateStocks)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumAdmin), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumAdmin), delete)
}

// findAll retrieves all products for a tenant
// @Summary Retrieves all products
// @Tags Products
// @Produce json
// @Success 200 {array} responses.ProductResponse "List of products"
// @Failure 500 {object} string "Error retrieving products"
// @Router /products [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.ProductResponse
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateProductResponse(x)
		dtos = append(dtos, newDto)
	}
	if len(dtos) == 0 {
		return c.JSON(make([]string, 0))
	}
	return c.JSON(dtos)
}

// findById retrieves a specific product by ID
// @Summary Retrieves a specific product by ID
// @Tags Products
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} responses.ProductResponse "Product"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Product not found"
// @Router /products/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateProductResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing product
// @Summary Updates a product
// @Tags Products
// @Produce json
// @Param id path string true "Product ID"
// @Param body body requests.UpdateProductRequest true "Product data"
// @Success 200 {object} responses.ProductResponse "Updated product"
// @Failure 400 {object} string "Invalid input or ID"
// @Failure 404 {object} string "Product not found"
// @Router /products/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newProduct := requests.UpdateProductRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newProduct); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateProductResponse(DAO.Update(id, *user.CompanyID, newProduct)))
	}
}

// delete removes a product by ID
// @Summary Deletes a product
// @Tags Products
// @Param id path string true "Product ID"
// @Success 204 {string} string "Product deleted"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Product not found"
// @Router /products/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, *user.CompanyID)
		return c.Status(204).SendString("Product deleted")
	}
}

// create adds a new product
// @Summary Creates a new product
// @Tags Products
// @Produce json
// @Param body body requests.CreateProductRequest true "Product data"
// @Success 201 {object} responses.ProductResponse "Created product"
// @Failure 400 {object} string "Invalid input"
// @Router /products [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newProduct := requests.CreateProductRequest{}
	if err := c.BodyParser(&newProduct); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateProductResponse(DAO.Create(user, newProduct)))
}

// updateStocks updates the stock quantities for products
// @Summary Updates stock quantities for products
// @Tags Products
// @Produce json
// @Param body body requests.UpdateStockRequest true "Stock movements data"
// @Success 200 {string} string "Stock updated"
// @Failure 400 {object} string "Invalid input"
// @Failure 500 {object} string "Internal server error"
// @Router /products/update-stocks [post]
func updateStocks(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	movements := requests.UpdateStockRequest{}
	if err := c.BodyParser(&movements); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	err := DAO.UpdateStocks(*user.CompanyID, movements)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Can't update stocks in database")
	}

	return c.Status(fiber.StatusOK).SendString("Stock updated")
}
