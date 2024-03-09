package auth

import (
	"back/internal/api/users"
	"back/internal/lib/models"
	"github.com/gofiber/fiber/v2"
)

func Secure() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		email := c.Get("X-Auth-User")
		if email == "" {
			return c.Status(403).SendString("Forbidden access")
		}

		user := users.DAO.FindMe(email)

		if user.Email == "" {
			user = models.User{
				Email:     email,
				FirstName: "",
				LastName:  "",
				CompanyID: nil,
			}
			users.DAO.Create(user)
		}
		c.Locals("user", user)

		return c.Next()
	}
}
