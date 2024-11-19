package company

import (
	"back/config"
	"back/internal/api/billCustomization"
	"back/internal/api/quoteCustomization"
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the routes for company management
func InitRoutes(group fiber.Router) {
	router := group.Group("/company")
	router.Get("/mine", findMine)
	router.Patch("/mine", auth.RoleRequired(enums.RoleEnumOwner), updateMine)
	router.Post("/", create)
	router.Post("/upload-logo", auth.RoleRequired(enums.RoleEnumOwner), uploadLogo)
	router.Get("/:id/logo", getLogo)
}

// findMine retrieves the organization associated with the authenticated user
// @Summary Retrieves user's organization
// @Tags Company
// @Produce json
// @Success 200 {object} responses.OrganizationResponse "User's organization data"
// @Failure 401 {object} string "Unauthorized"
// @Router /company/mine [get]
func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(responses.CreateOrganizationResponse(DAO.FindOneById(*user.CompanyID)))
}

// create creates a new organization for the authenticated user
// @Summary Creates a new organization
// @Tags Company
// @Accept json
// @Produce json
// @Param organization body requests.OrganizationRequest true "New organization data"
// @Success 201 {object} responses.OrganizationResponse "Created organization"
// @Failure 400 {object} string "Malformed organization data"
// @Failure 409 {object} string "Organization already exists"
// @Failure 500 {object} string "Server error"
// @Router /company [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID != nil {
		return fiber.NewError(fiber.StatusConflict, "You already have an organization")
	}
	newOrganization := requests.OrganizationRequest{}
	err := c.BodyParser(&newOrganization)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Malformed organization")
	}
	organization := DAO.Create(user.Email, newOrganization)

	quoteCustomization.DAO.Create(organization.ID, requests.QuoteCustomizationRequest{})
	billCustomization.DAO.Create(organization.ID, requests.BillCustomizationRequest{})

	if organization.ID == "" {
		return fiber.NewError(fiber.StatusInternalServerError, "Organization creation error")
	}
	user.CompanyID = &organization.ID
	return c.JSON(responses.CreateOrganizationResponse(organization))
}

// updateMine updates the user's organization information
// @Summary Updates user's organization
// @Tags Company
// @Accept json
// @Produce json
// @Param organization body requests.OrganizationRequest true "Updated organization data"
// @Success 200 {object} responses.OrganizationResponse "Updated organization data"
// @Failure 400 {object} string "Malformed organization data"
// @Failure 401 {object} string "Unauthorized"
// @Router /company/mine [patch]
func updateMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newOrganization := requests.OrganizationRequest{}
	err := c.BodyParser(&newOrganization)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Can't parse organization")
	}
	organization := DAO.Update(*user.CompanyID, newOrganization)
	return c.JSON(responses.CreateOrganizationResponse(organization))
}

// uploadLogo uploads a new logo for the user's organization
// @Summary Uploads a logo for the user's organization
// @Tags Company
// @Accept multipart/form-data
// @Produce plain
// @Param logo formData file true "Logo file"
// @Success 200 {string} string "Logo URL"
// @Failure 500 {string} string "Error when processing logo file"
// @Failure 401 {object} string "Unauthorized"
// @Router /company/upload-logo [post]
func uploadLogo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	organization := DAO.FindOneById(*user.CompanyID)
	file, err := c.FormFile("logo")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error when getting logo file")
	}
	err = os.MkdirAll(config.Get().UploadDir+fmt.Sprintf("/%s/", organization.ID), os.ModePerm)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error when creating directory : " + err.Error())
	}
	err = c.SaveFile(file, config.Get().UploadDir+fmt.Sprintf("/%s/logo.png", organization.ID))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error when saving logo file : " + err.Error())
	}
	newPath := fmt.Sprintf("%s/api/v1/company/%s/logo", c.BaseURL(), *user.CompanyID)
	organization = DAO.Update(organization.ID, requests.OrganizationRequest{
		Logo: &newPath,
	})
	return c.SendString(newPath)
}

// getLogo retrieves the logo for a specific organization
// @Summary Retrieves organization's logo
// @Tags Company
// @Produce image/png
// @Param id path string true "Organization ID"
// @Success 200 {file} file "Organization's logo"
// @Failure 400 {object} responses.ErrorResponse "No ID specified"
// @Router /company/{id}/logo [get]
func getLogo(c *fiber.Ctx) error {
	organizationId := c.Params("id")
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil || organizationId == "" || organizationId != *user.CompanyID {
		return c.Status(400).JSON(&responses.ErrorResponse{
			Code:    400,
			Message: "No id specified",
		})
	}

	return c.SendFile(config.Get().UploadDir + fmt.Sprintf("/%s/logo.png", organizationId))
}
