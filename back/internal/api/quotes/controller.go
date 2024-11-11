package quotes

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the routes for quotes management
func InitRoutes(api fiber.Router) {
	router := api.Group("/quotes")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Post("/:id/bill", auth.RoleRequired(enums.RoleEnumEditor), createBill)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
	router.Post("/:id/duplicate", auth.RoleRequired(enums.RoleEnumEditor), duplicate)
}

// findAll retrieves all quotes for a tenant with optional status filtering
// @Summary Retrieves all quotes with optional status filtering
// @Tags Quotes
// @Produce json
// @Param status query string false "Filter by quote status"
// @Param not_status query string false "Filter by quotes not having these statuses"
// @Success 200 {array} responses.QuoteResponse "List of quotes"
// @Failure 400 {object} string "Invalid query parameters"
// @Router /quotes [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	status := c.Query("status")
	not_status := c.Query("not_status")
	if status != "" {
		var arr []string
		if err := json.Unmarshal([]byte(status), &arr); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Bad request")
		}
		return c.JSON(responses.CreateQuoteResponseList(DAO.FindAllByTenantByStatusIn(*user.CompanyID, arr)).Quotes)
	}
	if not_status != "" {
		var arr []string
		if err := json.Unmarshal([]byte(not_status), &arr); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Bad request")
		}
		return c.JSON(responses.CreateQuoteResponseList(DAO.FindAllByTenantByStatusNotIn(*user.CompanyID, arr)).Quotes)
	}

	return c.JSON(responses.CreateQuoteResponseList(DAO.FindAllByTenant(*user.CompanyID)).Quotes)
}

// findById retrieves a specific quote by its ID
// @Summary Retrieves a quote by ID
// @Tags Quotes
// @Produce json
// @Param id path string true "Quote ID"
// @Success 200 {object} responses.QuoteResponse "Quote details"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Quote not found"
// @Router /quotes/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateQuoteResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing quote by ID
// @Summary Updates a quote by ID
// @Tags Quotes
// @Produce json
// @Param id path string true "Quote ID"
// @Param body body requests.UpdateQuoteRequest true "Quote update data"
// @Success 200 {object} responses.QuoteResponse "Updated quote details"
// @Failure 400 {object} string "Invalid input or ID"
// @Failure 404 {object} string "Quote not found"
// @Router /quotes/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuote := requests.UpdateQuoteRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newQuote); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateQuoteResponse(DAO.Update(id, *user.CompanyID, newQuote)))
	}
}

// create adds a new quote
// @Summary Creates a new quote
// @Tags Quotes
// @Produce json
// @Param body body requests.CreateQuoteRequest true "Quote creation data"
// @Success 201 {object} responses.QuoteResponse "Created quote details"
// @Failure 400 {object} string "Invalid input"
// @Router /quotes [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuote := requests.CreateQuoteRequest{}
	if err := c.BodyParser(&newQuote); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateQuoteResponse(DAO.Create(user, newQuote)))
}

// createBill generates a bill from a quote
// @Summary Generates a bill from a quote
// @Tags Quotes
// @Produce json
// @Param id path string true "Quote ID"
// @Success 200 {object} responses.BillResponse "Generated bill details"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Quote not found"
// @Router /quotes/{id}/bill [post]
func createBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateBillResponse(DAO.CreateBill(user, id)))
	}
}

// duplicate creates a copy of a quote if it's in a duplicable state
// @Summary Duplicates a quote if it is in a duplicable state (REFUSED or ARCHIVED)
// @Tags Quotes
// @Param id path string true "Quote ID"
// @Success 200 {object} responses.QuoteResponse "Duplicated quote details"
// @Failure 400 {object} string "Quote is not duplicable"
// @Failure 404 {object} string "Quote not found"
// @Router /quotes/{id}/duplicate [post]
func duplicate(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id != "" {
		existingQuote := DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if existingQuote.Status.IsDuplicable() {
			return c.JSON(responses.CreateQuoteResponse(DAO.Duplicate(id, *user.CompanyID)))
		} else {
			return fiber.NewError(400, "Quote is not duplicable it must be REFUSED or ARCHIVED")
		}
	}
	return fiber.NewError(400, "No id provided")
}

