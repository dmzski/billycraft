package outgoings

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the outgoing-related routes
func InitRoutes(api fiber.Router) {
	router := api.Group("/outgoings")
	router.Get("/", findAll)
	router.Get("/first", findFirst)
	router.Get("/current", findCurrent)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
}

// findAll retrieves all outgoing records for the user's organization
//	@Summary	Retrieves all outgoings for the organization
//	@Tags		Outgoings
//	@Produce	json
//	@Success	200	{array}		responses.OutgoingResponse	"List of outgoings"
//	@Failure	401	{object}	string						"Unauthorized"
//	@Router		/outgoings [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	dtos := make([]responses.OutgoingResponse, 0)
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		dtos = append(dtos, responses.CreateOutgoingResponse(x))
	}
	return c.JSON(dtos)
}

// findCurrent retrieves the current outgoing record based on the current date
//	@Summary	Retrieves the current outgoing based on date
//	@Tags		Outgoings
//	@Produce	json
//	@Success	200	{object}	responses.OutgoingResponse	"Current outgoing"
//	@Failure	401	{object}	string						"Unauthorized"
//	@Router		/outgoings/current [get]
func findCurrent(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(responses.CreateOutgoingResponse(DAO.FindOneByTenantAndDate(*user.CompanyID, time.Now())))
}

// findFirst retrieves the first outgoing record based on a specified date or current date
//	@Summary	Retrieves the first outgoing based on a specified date
//	@Tags		Outgoings
//	@Produce	json
//	@Param		date	query		string						false	"Date in RFC3339 format"
//	@Success	200		{object}	responses.OutgoingResponse	"First outgoing"
//	@Failure	400		{object}	string						"Invalid date format"
//	@Failure	401		{object}	string						"Unauthorized"
//	@Router		/outgoings/first [get]
func findFirst(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if c.Query("date") != "" {
		startDate, err := time.Parse(time.RFC3339, c.Query("date"))
		if err != nil {
			return fiber.NewError(400, "Can't parse date")
		}
		return c.JSON(responses.CreateOutgoingResponse(DAO.FindOneByTenantAndDate(*user.CompanyID, startDate)))
	}
	return c.JSON(responses.CreateOutgoingResponse(DAO.FindOneByTenantAndDate(*user.CompanyID, time.Now())))
}

// findById retrieves an outgoing record by its ID
//	@Summary	Retrieves an outgoing by ID
//	@Tags		Outgoings
//	@Produce	json
//	@Param		id	path		string						true	"Outgoing ID"
//	@Success	200	{object}	responses.OutgoingResponse	"Outgoing record"
//	@Failure	400	{object}	string						"Invalid ID"
//	@Failure	401	{object}	string						"Unauthorized"
//	@Router		/outgoings/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateOutgoingResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing outgoing record by ID
//	@Summary	Updates an outgoing by ID
//	@Tags		Outgoings
//	@Accept		json
//	@Produce	json
//	@Param		id			path		string						true	"Outgoing ID"
//	@Param		outgoing	body		requests.OutgoingRequest	true	"Outgoing data"
//	@Success	200			{object}	responses.OutgoingResponse	"Updated outgoing"
//	@Failure	400			{object}	string						"Invalid ID or body"
//	@Failure	401			{object}	string						"Unauthorized"
//	@Router		/outgoings/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	body := requests.OutgoingRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateOutgoingResponse(DAO.Update(id, *user.CompanyID, body)))
	}
}

// create adds a new outgoing record
//	@Summary	Creates a new outgoing
//	@Tags		Outgoings
//	@Accept		json
//	@Produce	json
//	@Param		outgoing	body		requests.OutgoingRequest	true	"Outgoing data"
//	@Success	200			{object}	responses.OutgoingResponse	"Created outgoing"
//	@Failure	400			{object}	string						"Malformed body"
//	@Failure	401			{object}	string						"Unauthorized"
//	@Router		/outgoings [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	body := requests.OutgoingRequest{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateOutgoingResponse(DAO.Create(user, body)))
}
