package billEmailCustomization

import (
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the routes for bill email customization
func InitRoutes(api fiber.Router) {
	router := api.Group("/bill-email-customization")
	router.Get("/", findAll)
	router.Get("/mine", findMine)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

// findAll retrieves all bill email customizations for the user's tenant
// @Summary Retrieves all bill email customizations
// @Tags Bill Email Customization
// @Produce json
// @Success 200 {array} responses.BillEmailCustomizationResponse "List of email customizations"
// @Failure 401 {object} responses.ErrorResponse "Unauthorized"
// @Router /bill-email-customization [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.BillEmailCustomizationResponse
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateBillEmailCustomizationResponse(x)
		dtos = append(dtos, newDto)
	}
	return c.JSON(dtos)
}

// findMine retrieves the user's bill email customization
// @Summary Retrieves the user's bill email customization
// @Tags Bill Email Customization
// @Produce json
// @Success 200 {object} responses.BillEmailCustomizationResponse "User's email customization"
// @Failure 401 {object} string "Unauthorized"
// @Failure 409 {object} string "No company associated"
// @Router /bill-email-customization/mine [get]
func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil {
		return fiber.NewError(fiber.StatusConflict, "No company")
	} else {
		return c.JSON(responses.CreateBillEmailCustomizationResponse(DAO.FindFirstByTenant(*user.CompanyID)))
	}
}

// findById retrieves a bill email customization by ID
// @Summary Retrieves a bill email customization by ID
// @Tags Bill Email Customization
// @Produce json
// @Param id path string true "Customization ID"
// @Success 200 {object} responses.BillEmailCustomizationResponse "Email customization by ID"
// @Failure 400 {object} string "No ID provided"
// @Failure 401 {object} string "Unauthorized"
// @Router /bill-email-customization/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateBillEmailCustomizationResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update updates a bill email customization by ID
// @Summary Updates a bill email customization
// @Tags Bill Email Customization
// @Accept json
// @Produce json
// @Param id path string true "Customization ID"
// @Param customization body requests.BillEmailCustomizationRequest true "Customization data"
// @Success 200 {object} responses.BillEmailCustomizationResponse "Updated customization"
// @Failure 400 {object} string "No ID provided or malformed body"
// @Failure 401 {object} string "Unauthorized"
// @Router /bill-email-customization/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBillEmailCustomization := requests.BillEmailCustomizationRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newBillEmailCustomization); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateBillEmailCustomizationResponse(DAO.Update(id, *user.CompanyID, newBillEmailCustomization)))
	}
}

// delete removes a bill email customization by ID
// @Summary Deletes a bill email customization
// @Tags Bill Email Customization
// @Param id path string true "Customization ID"
// @Success 204 {string} string "Customization deleted"
// @Failure 400 {object} string "No ID provided"
// @Failure 401 {object} string "Unauthorized"
// @Router /bill-email-customization/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("BillEmailCustomization deleted")
	}
}

// create creates a new bill email customization
// @Summary Creates a bill email customization
// @Tags Bill Email Customization
// @Accept json
// @Produce json
// @Param customization body requests.BillEmailCustomizationRequest true "Customization data"
// @Success 201 {object} responses.BillEmailCustomizationResponse "Created customization"
// @Failure 400 {object} string "Malformed body"
// @Failure 401 {object} string "Unauthorized"
// @Router /bill-email-customization [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBillEmailCustomization := requests.BillEmailCustomizationRequest{}
	if err := c.BodyParser(&newBillEmailCustomization); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateBillEmailCustomizationResponse(DAO.Create(*user.CompanyID, newBillEmailCustomization)))
}
