package outgoings

import (
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/outgoings")
	router.Get("/", findAll)
	router.Get("/first", findFirst)
	router.Get("/current", findCurrent)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	dtos := make([]dtos.OutgoingResponse, 0)
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		dtos = append(dtos, x.ToDTO())
	}
	return c.JSON(dtos)
}

func findCurrent(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(DAO.FindOneByTenantAndDate(*user.CompanyID, time.Now()).ToDTO())
}

func findFirst(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if c.Query("date") != "" {
		startDate, err := time.Parse(time.RFC3339, c.Query("date"))
		if err != nil {
			return fiber.NewError(400, "Can't parse date")
		}
		return c.JSON(DAO.FindOneByTenantAndDate(*user.CompanyID, startDate))
	}
	return c.JSON(DAO.FindOneByTenantAndDate(*user.CompanyID, time.Now()).ToDTO())
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
	body := dtos.OutgoingRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, body).ToDTO())
	}
}

func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	body := dtos.OutgoingRequest{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, body).ToDTO())
}
