package auth

import (
	"back/internal/api/users"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"io"
	"net/http"
	"slices"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Secure() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		authURL := "http://auth:8080/api/auth/check"

		req, err := http.NewRequest("GET", authURL, nil)
		if err != nil {
			return c.Status(500).SendString("Internal server error")
		}

		c.Request().Header.VisitAll(func(key, value []byte) {
			req.Header.Add(string(key), string(value))
		})

		cookieHeader := string(c.Request().Header.Peek("Cookie"))
		if cookieHeader != "" {
			cookies := strings.Split(cookieHeader, "; ")
			for _, cookie := range cookies {
				parts := strings.SplitN(cookie, "=", 2)
				if len(parts) == 2 {
					req.AddCookie(&http.Cookie{
						Name:  strings.TrimSpace(parts[0]),
						Value: strings.TrimSpace(parts[1]),
					})
				}
			}
		}

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return c.Status(500).SendString("Internal server error")
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return c.Status(403).SendString("Forbidden access")
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return c.Status(500).SendString("Internal server error")
		}

		email := string(body)
		if email == "" {
			return c.Status(403).SendString("Forbidden access")
		}

		user, err := users.DAO.FindMe(email)

		if user.Email == "" || err != nil {
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
