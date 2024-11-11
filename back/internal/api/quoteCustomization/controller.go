package quoteCustomization

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the quote customization routes
func InitRoutes(api fiber.Router) {
	router := api.Group("/quote-customization", auth.RoleRequired(enums.RoleEnumAdmin))
	router.Get("/", findAll)
	router.Get("/mine", findMine)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

// findAll retrieves all quote customizations for a tenant
// @Summary Retrieves all quote customizations
// @Tags QuoteCustomization
// @Produce json
// @Success 200 {array} responses.QuoteCustomizationResponse "List of quote customizations"
// @Failure 500 {object} string "Error retrieving quote customizations"
// @Router /quote-customization [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.QuoteCustomizationResponse
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateQuoteCustomizationResponse(x)
		dtos = append(dtos, newDto)
	}
	return c.JSON(dtos)
}

// findMine retrieves the current user's quote customization
// @Summary Retrieves the current user's quote customization
// @Tags QuoteCustomization
// @Produce json
// @Success 200 {object} responses.QuoteCustomizationResponse "Quote customization"
// @Failure 409 {object} string "No company associated with the user"
// @Router /quote-customization/mine [get]
func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil {
		return fiber.NewError(fiber.StatusConflict, "No company")
	} else {
		return c.JSON(responses.CreateQuoteCustomizationResponse(DAO.FindFirstByTenant(*user.CompanyID)))
	}
}

// findById retrieves a specific quote customization by ID
// @Summary Retrieves a specific quote customization by ID
// @Tags QuoteCustomization
// @Produce json
// @Param id path string true "Quote customization ID"
// @Success 200 {object} responses.QuoteCustomizationResponse "Quote customization"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Quote customization not found"
// @Router /quote-customization/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateQuoteCustomizationResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing quote customization
// @Summary Updates a quote customization
// @Tags QuoteCustomization
// @Produce json
// @Param id path string true "Quote customization ID"
// @Param body body requests.QuoteCustomizationRequest true "Quote customization data"
// @Success 200 {object} responses.QuoteCustomizationResponse "Updated quote customization"
// @Failure 400 {object} string "Invalid input or ID"
// @Failure 404 {object} string "Quote customization not found"
// @Router /quote-customization/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuoteCustomization := requests.QuoteCustomizationRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newQuoteCustomization); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateQuoteCustomizationResponse(DAO.Update(id, *user.CompanyID, newQuoteCustomization)))
	}
}

// delete removes a quote customization by ID
// @Summary Deletes a quote customization
// @Tags QuoteCustomization
// @Param id path string true "Quote customization ID"
// @Success 204 {string} string "Quote customization deleted"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Quote customization not found"
// @Router /quote-customization/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("QuoteCustomization deleted")
	}
}

// create adds a new quote customization
// @Summary Creates a new quote customization
// @Tags QuoteCustomization
// @Produce json
// @Param body body requests.QuoteCustomizationRequest true "Quote customization data"
// @Success 201 {object} responses.QuoteCustomizationResponse "Created quote customization"
// @Failure 400 {object} string "Invalid input"
// @Router /quote-customization [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuoteCustomization := requests.QuoteCustomizationRequest{}
	if err := c.BodyParser(&newQuoteCustomization); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateQuoteCustomizationResponse(DAO.Create(*user.CompanyID, newQuoteCustomization)))
}

