package todos

import (
	"back/internal/lib/auth"
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/todos")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumEditor), delete)
	router.Post("/:id/done", done)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	doneAfter := c.Query("done_after")
	status := c.Query("status")
	if status == "done" {
		return makeArrayResponse(c, DAO.FindAllByTenantAndIsDone(*user.CompanyID))
	}

	if doneAfter != "" {
		doneAfterDate, err := time.Parse(time.RFC3339, doneAfter)
		if err != nil {
			return c.Status(fiber.ErrBadRequest.Code).JSON(&dtos.Error{
				Code:    fiber.ErrBadRequest.Code,
				Message: "Can't parse date",
			})
		}

		return makeArrayResponse(c, DAO.FindAllByTenantAndDoneAfter(*user.CompanyID, doneAfterDate))
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

func makeArrayResponse(c *fiber.Ctx, array []models.Todo) error {
	var res []dtos.TodoResponse
	for _, x := range array {
		newDto := x.ToDTO()
		res = append(res, newDto)
	}

	if len(res) == 0 {
		return c.JSON(make([]string, 0))
	}

	return c.JSON(res)
}
