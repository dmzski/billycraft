package users

import (
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	router := api.Group("/users")
	router.Get("/", findAll)
	router.Get("/me", findMe)
	router.Patch("/me", updateMe)
	router.Delete("/remove-user", removeUser)
}

func findMe(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	dto := new(responses.UserResponse)
	dto.FromModel(user)
	return c.JSON(dto)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	role := c.Locals("role").(enums.RoleEnum)

	if user.CompanyID == nil || !enums.CheckRoleEqualsOrGreaterThan(role, enums.RoleEnumAdmin) {
		return c.Status(fiber.StatusUnauthorized).SendString("You don't have access to this")
	}

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
	DAO.SaveUser(user)
	dto := new(responses.UserResponse)
	dto.FromModel(user)

	return c.JSON(user)
}

func removeUser(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	role := c.Locals("role").(enums.RoleEnum)
	request := requests.RemoveUserRequest{}
	err := c.BodyParser(&request)
	if err != nil {
		return c.Status(fiber.ErrBadRequest.Code).JSON(&dtos.Error{
			Code:    fiber.ErrBadRequest.Code,
			Message: "Can't parse request",
		})
	}
	if user.CompanyID == nil || !enums.CheckRoleEqualsOrGreaterThan(role, enums.RoleEnumAdmin) {
		return c.Status(fiber.StatusUnauthorized).SendString("You can't do this")
	}
	err = DAO.LeaveCompany(request.Email, *user.CompanyID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error occured during processing your request")
	}

	return c.Status(fiber.StatusNoContent).SendString("User removed from company")
}

func makeArrayResponse(c *fiber.Ctx, array []models.User) error {
	res := make([]responses.UserResponse, 0)
	for _, x := range array {
		newDto := responses.UserResponse{}
		newDto.FromModel(x)
		res = append(res, newDto)
	}

	return c.JSON(res)
}
