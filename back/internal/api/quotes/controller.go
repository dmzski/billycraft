package quotes

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/quotes")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Post("/:id/bill", auth.RoleRequired(enums.RoleEnumEditor), createBill)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
	router.Post("/:id/duplicate", auth.RoleRequired(enums.RoleEnumEditor), duplicate)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	status := c.Query("status")
	not_status := c.Query("not_status")
	if status != "" {
		var arr []string
		if err := json.Unmarshal([]byte(status), &arr); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Bad request")
		}
		return c.JSON(responses.CreateQuoteResponseList(DAO.FindAllByTenantByStatusIn(*user.CompanyID, arr)).Quotes)
	}
	if not_status != "" {
		var arr []string
		if err := json.Unmarshal([]byte(not_status), &arr); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Bad request")
		}
		return c.JSON(responses.CreateQuoteResponseList(DAO.FindAllByTenantByStatusNotIn(*user.CompanyID, arr)).Quotes)
	}

	return c.JSON(responses.CreateQuoteResponseList(DAO.FindAllByTenant(*user.CompanyID)).Quotes)
}

func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateQuoteResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuote := requests.UpdateQuoteRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newQuote); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateQuoteResponse(DAO.Update(id, *user.CompanyID, newQuote)))
	}
}

func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newQuote := requests.CreateQuoteRequest{}
	if err := c.BodyParser(&newQuote); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateQuoteResponse(DAO.Create(user, newQuote)))
}

func createBill(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.CreateBill(user, id).ToDTO())
	}
}

func duplicate(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id != "" {
		existingQuote := DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		if existingQuote.Status.IsDuplicable() {
			return c.JSON(responses.CreateQuoteResponse(DAO.Duplicate(id, *user.CompanyID)))
		} else {
			return fiber.NewError(400, "Quote is not duplicable it must be REFUSED or ARCHIVED")
		}
	}
	return fiber.NewError(400, "No id provided")
}
