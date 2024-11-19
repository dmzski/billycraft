package bills

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the routes for bill management
func InitRoutes(api fiber.Router) {
	router := api.Group("/bills")
	router.Get("/", findAll)
	router.Get("/:id", findById)
	router.Post("/", auth.RoleRequired(enums.RoleEnumEditor), create)
	router.Post("/:id/duplicate", auth.RoleRequired(enums.RoleEnumEditor), duplicate)
	router.Patch("/:id", auth.RoleRequired(enums.RoleEnumEditor), update)
}

// findAll retrieves all bills for the user's tenant with optional filters
// @Summary Retrieves all bills
// @Tags Bills
// @Produce json
// @Param filter query string false "Filter by criteria (e.g., 'not_paid')"
// @Param status query []string false "Filter by status (e.g., ['PAID', 'UNPAID'])"
// @Param not_status query []string false "Exclude specific statuses (e.g., ['CANCELED'])"
// @Success 200 {array} responses.BillResponse "List of bills"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Router /bills [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var res []models.Bill
  params := requests.ListBillsParams{}
  if err := c.QueryParser(&params) ; err != nil {
    return fiber.NewError(fiber.StatusBadRequest, "Bad request")
  }
	if len(params.Status) > 0 {
		res = DAO.FindAllByTenantByStatusIn(*user.CompanyID, params.Status)
	} else if len(params.NotStatus) > 0 {
		res = DAO.FindAllByTenantByStatusNotIn(*user.CompanyID, params.NotStatus)
	} else {
		res = DAO.FindAllByTenant(*user.CompanyID)
	}

	return makeArrayResponse(c, res)
}

// findById retrieves a bill by ID
// @Summary Retrieves a bill by ID
// @Tags Bills
// @Produce json
// @Param id path string true "Bill ID"
// @Success 200 {object} responses.BillResponse "Bill details"
// @Failure 400 {object} string "No ID provided"
// @Failure 401 {object} string "Unauthorized"
// @Router /bills/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateBillResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update modifies a bill by ID
// @Summary Updates a bill by ID
// @Tags Bills
// @Accept json
// @Produce json
// @Param id path string true "Bill ID"
// @Param bill body requests.BillRequest true "Updated bill data"
// @Success 200 {object} responses.BillResponse "Updated bill"
// @Failure 400 {object} string "No ID provided or malformed body"
// @Failure 401 {object} string "Unauthorized"
// @Router /bills/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBill := requests.BillRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newBill); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateBillResponse(DAO.Update(id, *user.CompanyID, newBill)))
	}
}

// create adds a new bill
// @Summary Creates a new bill
// @Tags Bills
// @Accept json
// @Produce json
// @Param bill body requests.BillRequest true "New bill data"
// @Success 201 {object} responses.BillResponse "Created bill"
// @Failure 400 {object} string "Malformed body"
// @Failure 401 {object} string "Unauthorized"
// @Router /bills [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBill := requests.BillRequest{}
	if err := c.BodyParser(&newBill); err != nil {
		return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
	}

	return c.JSON(responses.CreateBillResponse(DAO.Create(user, newBill)))
}

// duplicate duplicates an existing bill by ID
// @Summary Duplicates a bill by ID
// @Tags Bills
// @Produce json
// @Param id path string true "Bill ID to duplicate"
// @Success 200 {object} responses.BillResponse "Duplicated bill"
// @Failure 400 {object} string "No ID provided or bill not duplicable"
// @Failure 401 {object} string "Unauthorized"
// @Router /bills/{id}/duplicate [post]
func duplicate(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id != "" {
		existingBill := DAO.FindOneByIdAndTenant(id, *user.CompanyID)
		println(existingBill.Status)
		if existingBill.Status.IsDuplicable() {
			return c.JSON(responses.CreateBillResponse(DAO.Duplicate(id, *user.CompanyID)))
		} else {
			return fiber.NewError(400, "Bill is not duplicable; it must be REFUSED or ARCHIVED")
		}
	}
	return fiber.NewError(400, "No id provided")
}

// makeArrayResponse converts a list of Bill models to a list of BillResponse and sends it as JSON
func makeArrayResponse(c *fiber.Ctx, array []models.Bill) error {
	res := make([]responses.BillResponse, 0)
	for _, x := range array {
		newDto := responses.CreateBillResponse(x)
		res = append(res, newDto)
	}

	return c.JSON(res)
}
