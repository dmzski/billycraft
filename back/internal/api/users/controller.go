package users

import (
	"back/internal/lib/dtos"
	"back/internal/lib/models"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/users")
	router.Get("/", findAll)
	router.Get("/me", findMe)
	router.Patch("/me", updateMe)
	router.Patch("/me/leave-company", leaveCompany)
	router.Patch("/me/join-company/:id", joinCompany)
}

func findMe(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(user.ToDTO())
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	users := DAO.FindAllByCompanyId(*user.CompanyID)
	return makeArrayResponse(c, users)
}

func updateMe(c *fiber.Ctx) error {
	newUser := dtos.User{}
	err := c.BodyParser(&newUser)
	if err != nil {
		return c.Status(fiber.ErrBadRequest.Code).JSON(&dtos.Error{
			Code:    fiber.ErrBadRequest.Code,
			Message: "Can't parse user",
		})
	}
	user := c.Locals("user").(models.User)
	user.FirstName = newUser.FirstName
	user.LastName = newUser.LastName
	return c.JSON(DAO.SaveUser(user).ToDTO())
}

func leaveCompany(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(DAO.LeaveCompany(user).ToDTO())
}

func joinCompany(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.Email == "test" {
		if id := c.Params("id", ""); id != "" {
			return c.SendString("bad id")
		} else {
			DAO.JoinCompany(user.Email, id)
			return c.SendStatus(200)
		}
	}
	return c.SendStatus(fiber.StatusNotImplemented)
}

func makeArrayResponse(c *fiber.Ctx, array []models.User) error {
	res := make([]dtos.User, 0)
	for _, x := range array {
		newDto := x.ToDTO()
		res = append(res, newDto)
	}

	return c.JSON(res)
}
