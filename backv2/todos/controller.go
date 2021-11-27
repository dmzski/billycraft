package todos

import (
	"backv2/dtos"
	"backv2/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/todos")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
	router.Post("/:id/done", done)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []dtos.Todo
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
	newTodo := dtos.TodoRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newTodo); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, newTodo).ToDTO())
	}
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("Todo deleted")
	}
}
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newTodo := dtos.TodoRequest{}
	if err := c.BodyParser(&newTodo); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, newTodo).ToDTO())
}

func done(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.Done(id, user).ToDTO())
	}
}
