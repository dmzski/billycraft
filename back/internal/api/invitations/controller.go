package invitations

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(group fiber.Router) {
	router := group.Group("/invitations")
	router.Post("/", auth.RoleRequired(enums.RoleEnumAdmin), createInvite)
	router.Delete("/", auth.RoleRequired(enums.RoleEnumAdmin), deleteInvite)
	router.Post("/accept", acceptInvite)
	router.Post("/refuse", refuseInvite)
	router.Get("/mine/pending", findAllMinePending)
	router.Get("/", auth.RoleRequired(enums.RoleEnumAdmin), findAll)
}

func findAllMinePending(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	invitations := DAO.FindAllMyInvitationsPending(user.Email)

	return c.JSON(invitations)
}

func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	params := new(requests.InvitationFindAllParams)

	if err := c.QueryParser(params); err != nil {
		invitations := DAO.FindAllByOrganization(*user.CompanyID, *params)
		return c.JSON(makeArrayResponse(invitations))
	}

	invitations := DAO.FindAllByOrganization(*user.CompanyID, *params)

	return c.JSON(makeArrayResponse(invitations))
}

func createInvite(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	invitationRequest := requests.InvitationRequest{}
	err := c.BodyParser(&invitationRequest)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Can't parse invitation request")
	}
	if invitationRequest.Role == enums.RoleEnumOwner {
		return fiber.NewError(fiber.StatusUnauthorized, "You can't do this")
	}

	anInvitation, err := DAO.Create(*user.CompanyID, invitationRequest)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Can't add invitation in database")
	}

	return c.JSON(responses.CreateInvitationResponse(anInvitation))
}

func acceptInvite(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	acceptInvitationRequest := requests.AcceptInvitationRequest{}
	err := c.BodyParser(&acceptInvitationRequest)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Can't parse invitation request")
	}
	anInvitation, err := DAO.Accept(acceptInvitationRequest.CompanyID, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Can't accept invitation in database")
	}

	return c.JSON(responses.CreateInvitationResponse(anInvitation))
}

func refuseInvite(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	acceptInvitationRequest := requests.AcceptInvitationRequest{}
	err := c.BodyParser(&acceptInvitationRequest)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Can't parse invitation request")
	}
	anInvitation, err := DAO.Accept(acceptInvitationRequest.CompanyID, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Can't accept invitation in database")
	}

	return c.JSON(responses.CreateInvitationResponse(anInvitation))
}

func deleteInvite(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "You can't do this")
	}

	deleteInvitationRequest := requests.DeleteInvitationRequest{}
	err := c.BodyParser(&deleteInvitationRequest)
	if err != nil || deleteInvitationRequest.Email == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Can't parse request")
	}
	err = DAO.Delete(deleteInvitationRequest.Email, *user.CompanyID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Can't delete invitation in database")
	}

	return c.Status(fiber.StatusOK).SendString("Invitation deleted")
}

func makeArrayResponse(array []models.Invitation) []responses.InvitationResponse {
	res := make([]responses.InvitationResponse, 0)
	for _, anInvitation := range array {
		newDto := responses.CreateInvitationResponse(anInvitation)
		res = append(res, newDto)
	}

	return res
}
