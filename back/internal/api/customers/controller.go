package customers

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes routes for customer management
func InitRoutes(api fiber.Router) {
	router := api.Group("/customers")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumAdmin), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumAdmin), delete)
}

// findAll retrieves all customers for the current user's organization, optionally filtered by name
// @Summary Retrieves all customers
// @Tags Customers
// @Produce json
// @Param name_contains query string false "Name filter"
// @Success 200 {array} responses.CustomerResponse "List of customers"
// @Failure 401 {object} string "Unauthorized"
// @Router /customers [get]
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

// findById retrieves a specific customer by ID for the current user's organization
// @Summary Retrieves a customer by ID
// @Tags Customers
// @Produce json
// @Param id path string true "Customer ID"
// @Success 200 {object} responses.CustomerResponse "Customer data"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Router /customers/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateCustomerResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update updates a customer's information by ID
// @Summary Updates a customer by ID
// @Tags Customers
// @Accept json
// @Produce json
// @Param id path string true "Customer ID"
// @Param customer body requests.CustomerRequest true "Updated customer data"
// @Success 200 {object} responses.CustomerResponse "Updated customer data"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Router /customers/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newCustomer := requests.CustomerRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newCustomer); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateCustomerResponse(DAO.Update(id, *user.CompanyID, newCustomer)))
	}
}

// delete removes a customer by ID
// @Summary Deletes a customer by ID
// @Tags Customers
// @Produce plain
// @Param id path string true "Customer ID"
// @Success 204 {string} string "Customer deleted"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Router /customers/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, *user.CompanyID)
		return c.Status(204).SendString("Customer deleted")
	}
}

// create adds a new customer
// @Summary Creates a new customer
// @Tags Customers
// @Accept json
// @Produce json
// @Param customer body requests.CustomerRequest true "New customer data"
// @Success 201 {object} responses.CustomerResponse "Created customer"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Router /customers [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newCustomer := requests.CustomerRequest{}
	if err := c.BodyParser(&newCustomer); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateCustomerResponse(DAO.Create(user, newCustomer)))
}

// makeArrayResponse formats an array of customers into JSON
func makeArrayResponse(c *fiber.Ctx, array []models.Customer) error {
	res := make([]responses.CustomerResponse, 0)
	for _, x := range array {
		newDto := responses.CreateCustomerResponse(x)
		res = append(res, newDto)
	}

	return c.JSON(res)
}

