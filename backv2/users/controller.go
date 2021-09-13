package users

import (
	"backv2/dtos"
	"backv2/models"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/users")
	router.Get("/me", findMe)
	router.Patch("/me", updateMe)
	router.Patch("/me/leave-company", leaveCompany)
	router.Patch("/me/join-company/:id", joinCompany)
}

func findMe(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(user.ToDTO())
}

func updateMe(c *fiber.Ctx) error {
	newUser := dtos.User{}
	c.BodyParser(&newUser)
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
		if id, err := c.ParamsInt("id"); err != nil {
			return c.SendString("bad id")
		} else {
			DAO.JoinCompany(user.Email, id)
			return c.SendStatus(200)
		}
	}
	return c.SendStatus(fiber.StatusNotImplemented)
}
