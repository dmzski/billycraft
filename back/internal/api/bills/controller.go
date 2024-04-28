package bills

import (
	"back/internal/lib/auth"
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/bills")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var res = make([]models.Bill, 0)
	filter := c.Query("filter")
	status := c.Query("status")
	not_status := c.Query("not_status")
	if filter != "" {
		switch filter {
		case "not_paid":
			res = DAO.FindAllByTenantByNotPaid(*user.CompanyID)
		}
	} else if status != "" {
		var arr []string
		if err := json.Unmarshal([]byte(status), &arr); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Bad request")
		}
		res = DAO.FindAllByTenantByStatusIn(*user.CompanyID, arr)
	} else if not_status != "" {
		var arr []string
		if err := json.Unmarshal([]byte(not_status), &arr); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Bad request")
		}
		res = DAO.FindAllByTenantByStatusNotIn(*user.CompanyID, arr)
	} else {
		res = DAO.FindAllByTenant(*user.CompanyID)
	}

	return makeArrayResponse(c, res)
}

func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(DAO.FindOneByIdAndTenant(id, *user.CompanyID).ToDTO())
	}
}

func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBill := dtos.Bill{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newBill); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(DAO.Update(id, *user.CompanyID, newBill).ToDTO())
	}
}

func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBill := dtos.Bill{}
	if err := c.BodyParser(&newBill); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(DAO.Create(user, newBill).ToDTO())
}

func makeArrayResponse(c *fiber.Ctx, array []models.Bill) error {
	res := make([]dtos.Bill, 0)
	for _, x := range array {
		newDto := x.ToDTO()
		res = append(res, newDto)
	}

	return c.JSON(res)
}
