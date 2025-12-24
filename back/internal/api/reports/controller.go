package reports

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"time"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the routes for report management
func InitRoutes(api fiber.Router) {
	router := api.Group("/reports")
	router.Get("/year", findForYear)
	router.Get("/month", findForMonth)
	router.Get("/", findAll)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Get("/:id", findById)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumEditor), delete)
}

// findForMonth retrieves a report for a specific month based on the provided date
//	@Summary	Retrieves a report for a specific month
//	@Tags		Reports
//	@Produce	json
//	@Param		date	query		string						true	"Date in RFC3339 format"
//	@Success	200		{object}	responses.ReportResponse	"Report details for the month"
//	@Failure	400		{object}	string						"Invalid date format"
//	@Router		/reports/month [get]
func findForMonth(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	date, err := time.Parse(time.RFC3339, c.Query("date"))
	if err != nil {
		return c.Status(400).SendString("Bad date : " + c.Query("date") + " : " + err.Error())
	}
	return c.JSON(responses.CreateReportResponse(DAO.BuildForMonth(*user.CompanyID, date)))
}

// findAll retrieves all reports for a tenant
//	@Summary	Retrieves all reports for a tenant
//	@Tags		Reports
//	@Produce	json
//	@Success	200	{array}	responses.ReportResponse	"List of all reports"
//	@Router		/reports [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	dtos := make([]responses.ReportResponse, 0)
	for _, report := range DAO.FindAllByTenant(*user.CompanyID) {
		dtos = append(dtos, responses.CreateReportResponse(report))
	}
	return c.JSON(dtos)
}

// findById retrieves a specific report by ID
//	@Summary	Retrieves a report by ID
//	@Tags		Reports
//	@Produce	json
//	@Param		id	path		string						true	"Report ID"
//	@Success	200	{object}	responses.ReportResponse	"Report details"
//	@Failure	400	{object}	string						"Invalid ID"
//	@Failure	404	{object}	string						"Report not found"
//	@Router		/reports/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateReportResponse(DAO.FindOneByTenantAndId(*user.CompanyID, id)))
	}
}

// create generates a new report
//	@Summary	Creates a new report
//	@Tags		Reports
//	@Accept		json
//	@Produce	json
//	@Param		body	body		requests.ReportRequest		true	"Report creation data"
//	@Success	201		{object}	responses.ReportResponse	"Created report details"
//	@Failure	400		{object}	string						"Invalid input data"
//	@Router		/reports [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newReport := requests.ReportRequest{}
	if err := c.BodyParser(&newReport); err != nil {
		return fiber.NewError(400, "Malformed body")
	}

	return c.JSON(responses.CreateReportResponse(DAO.Create(user, newReport)))
}

// delete removes a report by ID
//	@Summary	Deletes a report by ID
//	@Tags		Reports
//	@Produce	json
//	@Param		id	path		string	true	"Report ID"
//	@Success	204	{string}	string	"Report deleted"
//	@Failure	400	{object}	string	"Invalid ID"
//	@Router		/reports/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(*user.CompanyID, id)
		return c.SendStatus(fiber.StatusNoContent)
	}
}

// findForYear retrieves a report for a specific year based on the provided date
//	@Summary	Retrieves a report for a specific year
//	@Tags		Reports
//	@Produce	json
//	@Param		date	query		string						true	"Date in RFC3339 format"
//	@Success	200		{object}	responses.ReportResponse	"Report details for the year"
//	@Failure	400		{object}	string						"Invalid date format"
//	@Router		/reports/year [get]
func findForYear(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	date, err := time.Parse(time.RFC3339, c.Query("date"))
	if err != nil {
		return c.Status(400).SendString("Bad date : " + c.Query("date") + " : " + err.Error())
	}
	return c.JSON(responses.CreateReportResponse(DAO.BuildForYear(*user.CompanyID, date)))
}
