package todos

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

func InitRoutes(api fiber.Router) {
	router := api.Group("/todos")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
	router.Delete("/:id", auth.RoleRequired(enums.RoleEnumEditor), delete)
	router.Post("/:id/done", done)
	router.Post("/:id/undo", undo)
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
			return c.Status(fiber.ErrBadRequest.Code).JSON(&responses.ErrorResponse{
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
		return c.JSON(responses.CreateTodoResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newTodo := requests.TodoRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newTodo); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateTodoResponse(DAO.Update(id, *user.CompanyID, newTodo)))
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
	newTodo := requests.TodoRequest{}
	if err := c.BodyParser(&newTodo); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateTodoResponse(DAO.Create(user, newTodo)))
}

func done(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateTodoResponse(DAO.Done(id, user)))
	}
}

func undo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateTodoResponse(DAO.Undo(id, user)))
	}
}

func makeArrayResponse(c *fiber.Ctx, array []models.Todo) error {
	var res []responses.TodoResponse
	for _, todo := range array {
		newResponse := responses.CreateTodoResponse(todo)
		res = append(res, newResponse)
	}

	if len(res) == 0 {
		return c.JSON(make([]string, 0))
	}

	return c.JSON(res)
}
