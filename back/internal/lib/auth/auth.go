package auth

import (
	"back/internal/api/users"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"slices"

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
		roleIndex := slices.IndexFunc(user.Roles, func(aRole *models.Role) bool {
			return aRole.CompanyID == *user.CompanyID
		})
		if roleIndex > -1 {
			c.Locals("user", user)
			c.Locals("role", user.Roles[roleIndex].Role)
		} else {
			c.Locals("user", user)
			c.Locals("role", "")
		}

		return c.Next()
	}
}

func RoleRequired(minRole enums.RoleEnum) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		role := c.Locals("role").(enums.RoleEnum)

		if role == "" {
			return c.Status(fiber.StatusUnauthorized).SendString("You don't have access to this")
		}

		if enums.CheckRoleEqualsOrGreaterThan(role, minRole) {
			return c.Next()
		}

		return c.Status(fiber.StatusUnauthorized).SendString("You don't have access to this")
	}
}
