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

// InitRoutes initializes the routes for managing todos
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

// findAll retrieves all todos for a tenant with optional filters
// @Summary Retrieves all todos for a tenant
// @Tags Todos
// @Produce json
// @Param done_after query string false "Filter by done after date"
// @Param status query string false "Filter by status (done or not)"
// @Success 200 {array} responses.TodoResponse "List of todos"
// @Failure 400 {object} responses.ErrorResponse "Invalid query parameters"
// @Router /todos [get]
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

// findById retrieves a specific todo by ID
// @Summary Retrieves a todo by ID
// @Tags Todos
// @Produce json
// @Param id path string true "Todo ID"
// @Success 200 {object} responses.TodoResponse "Todo details"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Todo not found"
// @Router /todos/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateTodoResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies an existing todo
// @Summary Modifies an existing todo
// @Tags Todos
// @Produce json
// @Param id path string true "Todo ID"
// @Param body body requests.TodoRequest true "Todo update data"
// @Success 200 {object} responses.TodoResponse "Updated todo details"
// @Failure 400 {object} string "Invalid input data"
// @Failure 404 {object} string "Todo not found"
// @Router /todos/{id} [patch]
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

// delete removes a todo by ID
// @Summary Deletes a todo by ID
// @Tags Todos
// @Produce json
// @Param id path string true "Todo ID"
// @Success 204 {string} string "Todo deleted"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Todo not found"
// @Router /todos/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("Todo deleted")
	}
}

// create generates a new todo
// @Summary Creates a new todo
// @Tags Todos
// @Produce json
// @Param body body requests.TodoRequest true "Todo creation data"
// @Success 201 {object} responses.TodoResponse "Created todo details"
// @Failure 400 {object} string "Invalid input data"
// @Router /todos [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newTodo := requests.TodoRequest{}
	if err := c.BodyParser(&newTodo); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateTodoResponse(DAO.Create(user, newTodo)))
}

// done marks a todo as done
// @Summary Marks a todo as done
// @Tags Todos
// @Produce json
// @Param id path string true "Todo ID"
// @Success 200 {object} responses.TodoResponse "Updated todo details"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Todo not found"
// @Router /todos/{id}/done [post]
func done(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateTodoResponse(DAO.Done(id, user)))
	}
}

// undo reverts a todo to its undone state
// @Summary Reverts a todo to its undone state
// @Tags Todos
// @Produce json
// @Param id path string true "Todo ID"
// @Success 200 {object} responses.TodoResponse "Updated todo details"
// @Failure 400 {object} string "Invalid ID"
// @Failure 404 {object} string "Todo not found"
// @Router /todos/{id}/undo [post]
func undo(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateTodoResponse(DAO.Undo(id, user)))
	}
}

// makeArrayResponse converts a list of todos into a response array
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
