package reports

import (
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/reports")
	router.Get("/year", findForYear)
	router.Get("/month", findForMonth)
	router.Get("/", findAll)
	router.Post("/", create)
	router.Get("/:id", findById)
	router.Delete("/:id", delete)
	router.Patch("/:id", patch)
}

func findForMonth(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	date, err := time.Parse(time.RFC3339, c.Query("date"))
	if err != nil {
		return c.Status(400).SendString("Bad date : " + c.Query("date") + " : " + err.Error())
	}
	return c.JSON(DAO.BuildForMonth(*user.CompanyID, date).ToDTO())
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	dtos := make([]dtos.ReportResponse, 0)
	for _, report := range DAO.FindAllByTenant(*user.CompanyID) {
		dtos = append(dtos, report.ToDTO())
	}
	return c.JSON(dtos)
}

func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.FindOneByTenantAndId(*user.CompanyID, id).ToDTO())
	}
}

func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newReport := dtos.ReportRequest{}
	if err := c.BodyParser(&newReport); err != nil {
		return fiber.NewError(400, "Malformed body")
	}

	return c.JSON(DAO.Create(user, newReport).ToDTO())
}
func patch(c *fiber.Ctx) error {
	return fiber.NewError(fiber.StatusNotImplemented)
}

func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		DAO.Delete(*user.CompanyID, id)
		return c.SendStatus(fiber.StatusNoContent)
	}
}

func findForYear(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	date, err := time.Parse(time.RFC3339, c.Query("date"))
	if err != nil {
		return c.Status(400).SendString("Bad date : " + c.Query("date") + " : " + err.Error())
	}
	return c.JSON(DAO.BuildForYear(*user.CompanyID, date).ToDTO())
}
