package users

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initializes the routes for managing users
func InitRoutes(api fiber.Router) {
	router := api.Group("/users")
	router.Get("/", findAll)
	router.Get("/me", findMe)
	router.Patch("/me", updateMe)
	router.Delete("/remove-user", removeUser)
}

// findMe retrieves the current authenticated user's data
// @Summary Retrieves the current user's data
// @Tags Users
// @Produce json
// @Success 200 {object} responses.UserResponse "Current user details"
// @Failure 401 {object} string "Unauthorized"
// @Router /users/me [get]
func findMe(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.JSON(responses.CreateUserResponse(user))
}

// findAll retrieves all users in the company for an admin
// @Summary Retrieves all users in the company
// @Tags Users
// @Produce json
// @Success 200 {array} responses.UserResponse "List of users"
// @Failure 401 {object} string "Unauthorized"
// @Failure 403 {object} string "Forbidden"
// @Router /users [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	role := c.Locals("role").(enums.RoleEnum)

	if user.CompanyID == nil || !enums.CheckRoleEqualsOrGreaterThan(role, enums.RoleEnumAdmin) {
		return c.Status(fiber.StatusUnauthorized).SendString("You don't have access to this")
	}

	users := DAO.FindAllByCompanyId(*user.CompanyID)
	return makeArrayResponse(c, users)
}

// updateMe allows the current user to update their own profile
// @Summary Updates the current user's profile
// @Tags Users
// @Produce json
// @Param body body requests.UserRequest true "User update data"
// @Success 200 {object} responses.UserResponse "Updated user details"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Router /users/me [patch]
func updateMe(c *fiber.Ctx) error {
	newUser := requests.UserRequest{}
	err := c.BodyParser(&newUser)
	if err != nil {
		return c.Status(fiber.ErrBadRequest.Code).JSON(&responses.ErrorResponse{
			Code:    fiber.ErrBadRequest.Code,
			Message: "Can't parse user",
		})
	}
	user := c.Locals("user").(models.User)
	user.FirstName = newUser.FirstName
	user.LastName = newUser.LastName
	DAO.SaveUser(user)

	return c.JSON(responses.CreateUserResponse(user))
}

// removeUser removes a user from the company by email
// @Summary Removes a user from the company
// @Tags Users
// @Produce json
// @Param body body requests.RemoveUserRequest true "Remove user request data"
// @Success 204 {string} string "User removed from company"
// @Failure 400 {object} string "Bad request"
// @Failure 401 {object} string "Unauthorized"
// @Failure 404 {object} string "User not found"
// @Router /users/remove-user [delete]
func removeUser(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	role := c.Locals("role").(enums.RoleEnum)
	request := requests.RemoveUserRequest{}
	err := c.BodyParser(&request)
	if err != nil {
		return c.Status(fiber.ErrBadRequest.Code).JSON(&responses.ErrorResponse{
			Code:    fiber.ErrBadRequest.Code,
			Message: "Can't parse request",
		})
	}
	if user.CompanyID == nil || !enums.CheckRoleEqualsOrGreaterThan(role, enums.RoleEnumAdmin) {
		return c.Status(fiber.StatusUnauthorized).SendString("You can't do this")
	}
	err = DAO.LeaveCompany(request.Email, *user.CompanyID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error occurred during processing your request")
	}

	return c.Status(fiber.StatusNoContent).SendString("User removed from company")
}

// makeArrayResponse converts a list of users into a response array
func makeArrayResponse(c *fiber.Ctx, array []models.User) error {
	res := make([]responses.UserResponse, 0)
	for _, user := range array {
		newDto := responses.CreateUserResponse(user)
		res = append(res, newDto)
	}

	return c.JSON(res)
}

