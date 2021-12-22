package reports

import (
	"backv2/internal/lib/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/reports")
	router.Get("/year", findForYear)
	router.Get("/month", findForMonth)
}

func findForMonth(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	date, err := time.Parse(time.RFC3339, c.Query("date"))
	if err != nil {
		return c.Status(400).SendString("Bad date : " + c.Query("date") + " : " + err.Error())
	}
	return c.JSON(DAO.FindForMonth(*user.CompanyID, date))
}

func findForYear(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	date, err := time.Parse(time.RFC3339, c.Query("date"))
	if err != nil {
		return c.Status(400).SendString("Bad date : " + c.Query("date") + " : " + err.Error())
	}
	return c.JSON(DAO.FindForYear(*user.CompanyID, date))
}
