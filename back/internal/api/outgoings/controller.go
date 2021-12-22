package outgoings

import (
	"backv2/internal/lib/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/outgoings")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []OutgoingResponse
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := x.ToDTO()
		dtos = append(dtos, newDto)
	}
	if len(dtos) == 0 {
		return c.JSON(make([]string, 0))
	}
	return c.JSON(dtos)
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
	body := OutgoingRequest{}
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
	body := OutgoingRequest{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, body).ToDTO())
}
