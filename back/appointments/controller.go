package appointments

import (
	"backv2/dtos"
	"backv2/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/appointments")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
	router.Post("/:id/done", done)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	startDateFrom := c.Query("start_date_from")
	startDateTo := c.Query("start_date_to")
	if startDateFrom != "" {
		startDateFromDate, err := time.Parse(time.RFC3339, startDateFrom)
		if err != nil {
			return fiber.NewError(fiber.ErrBadRequest.Code, "Can't parse date")

		}
		if startDateTo != "" {
			startDateToDate, err := time.Parse(time.RFC3339, startDateTo)
			if err != nil {
				return fiber.NewError(fiber.ErrBadRequest.Code, "Can't parse date")
			}
			return makeArrayResponse(c, DAO.FindAllByTenantStartDateBetween(*user.CompanyID, startDateFromDate.Local(), startDateToDate.Local()))
		} else {
			return makeArrayResponse(c, DAO.FindAllByTenantStartDateGreaterThan(*user.CompanyID, startDateFromDate.Local()))
		}

	}
	return makeArrayResponse(c, DAO.FindAllByTenant(*user.CompanyID))
}
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.FindOneByIdAndTenant(id, *user.CompanyID).ToDTO())
	}
}
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newAppointment := dtos.AppointmentRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newAppointment); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, newAppointment).ToDTO())
	}
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("Appointment deleted")
	}
}
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newAppointment := dtos.AppointmentRequest{}
	if err := c.BodyParser(&newAppointment); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, newAppointment).ToDTO())
}

func done(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.Done(id, user).ToDTO())
	}
}

func makeArrayResponse(c *fiber.Ctx, array []models.Appointment) error {
	res := make([]dtos.Appointment, 0)
	for _, x := range array {
		newDto := x.ToDTO()
		res = append(res, newDto)
	}

	return c.JSON(res)
}
