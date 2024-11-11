package quoteEmailCustomization

import (
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the quote email customization routes
func InitRoutes(api fiber.Router) {
	router := api.Group("/quote-email-customization")
	router.Get("/", findAll)
	router.Get("/mine", findMine)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

// findAll retrieves all quote email customizations for a tenant
// @Summary Retrieves all quote email customizations
// @Tags QuoteEmailCustomization
// @Produce json
// @Success 200 {array} responses.QuoteEmailCustomizationResponse "List of quote email customizations"
// @Failure 500 {object} string "Error retrieving quote email customizations"
// @Router /quote-email-customization [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.QuoteEmailCustomizationResponse
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateQuoteEmailCustomizationResponse(x)
		dtos = append(dtos, newDto)
	}
	return c.JSON(dtos)
}

// findMine retrieves the current user's quote email customization
// @Summary Retrieves the current user's quote email customization
// @Tags QuoteEmailCustomization
// @Produce json
// @Success 200 {object} responses.QuoteEmailCustomizationResponse "Quote email customization"
// @Failure 409 {object} string "No company associated with the user"
// @Router /quote-email-customization/mine [get]
func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil {
		return fiber.NewError(fiber.StatusConflict, "No company")
	} else {
		return c.JSON(responses.CreateQuoteEmailCustomizationResponse(DAO.FindFirstByTenant(*user.CompanyID)))
	}
}

// findById retrieves a specific quote email customization by ID
// @Summary Retrieves a specific quote email customization by ID
// @Tags QuoteEmailCustomization
// @Produce json
// @Param id path string true "Quote email customization ID"
// @Success 200 {object} responses.QuoteEmailCustomizationResponse "Quote email customization"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Quote email customization not found"
// @Router /quote-email-customization/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateQuoteEmailCustomizationResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing quote email customization
// @Summary Updates a quote email customization
// @Tags QuoteEmailCustomization
// @Produce json
// @Param id path string true "Quote email customization ID"
// @Param body body requests.QuoteEmailCustomizationRequest true "Quote email customization data"
// @Success 200 {object} responses.QuoteEmailCustomizationResponse "Updated quote email customization"
// @Failure 400 {object} string "Invalid input or ID"
// @Failure 404 {object} string "Quote email customization not found"
// @Router /quote-email-customization/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuoteEmailCustomization := requests.QuoteEmailCustomizationRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newQuoteEmailCustomization); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateQuoteEmailCustomizationResponse(DAO.Update(id, *user.CompanyID, newQuoteEmailCustomization)))
	}
}

// delete removes a quote email customization by ID
// @Summary Deletes a quote email customization
// @Tags QuoteEmailCustomization
// @Param id path string true "Quote email customization ID"
// @Success 204 {string} string "Quote email customization deleted"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Quote email customization not found"
// @Router /quote-email-customization/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("QuoteEmailCustomization deleted")
	}
}

// create adds a new quote email customization
// @Summary Creates a new quote email customization
// @Tags QuoteEmailCustomization
// @Produce json
// @Param body body requests.QuoteEmailCustomizationRequest true "Quote email customization data"
// @Success 201 {object} responses.QuoteEmailCustomizationResponse "Created quote email customization"
// @Failure 400 {object} string "Invalid input"
// @Router /quote-email-customization [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuoteEmailCustomization := requests.QuoteEmailCustomizationRequest{}
	if err := c.BodyParser(&newQuoteEmailCustomization); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateQuoteEmailCustomizationResponse(DAO.Create(user, newQuoteEmailCustomization)))
}

