package billCustomization

import (
	"back/internal/lib/auth"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"back/internal/lib/responses"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// InitRoutes initialise les routes pour la personnalisation des factures
func InitRoutes(api fiber.Router) {
	router := api.Group("/bill-customization", auth.RoleRequired(enums.RoleEnumAdmin))
	router.Get("/", findAll)
	router.Get("/mine", findMine)
	router.Get("/:id", findById)
	router.Post("/", create)
	router.Patch("/:id", update)
	router.Delete("/:id", delete)
}

// findAll récupère toutes les personnalisations de factures pour le locataire de l'utilisateur
// @Summary Récupère toutes les personnalisations de factures
// @Tags Bill Customization
// @Produce json
// @Success 200 {array} responses.BillCustomizationResponse "Liste des personnalisations"
// @Failure 401 {object} string "Non autorisé"
// @Router /bill-customization [get]
func findAll(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	var dtos []responses.BillCustomizationResponse
	for _, x := range DAO.FindAllByTenant(*user.CompanyID) {
		newDto := responses.CreateBillCustomizationResponse(x)
		dtos = append(dtos, newDto)
	}
	return c.JSON(dtos)
}

// findMine récupère la personnalisation de facture de l'utilisateur connecté
// @Summary Récupère la personnalisation de facture de l'utilisateur
// @Tags Bill Customization
// @Produce json
// @Success 200 {object} responses.BillCustomizationResponse "Personnalisation de facture"
// @Failure 401 {object} string "Non autorisé"
// @Failure 409 {object} string "Aucune entreprise associée"
// @Router /bill-customization/mine [get]
func findMine(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if user.CompanyID == nil {
		return fiber.NewError(fiber.StatusConflict, "No company")
	} else {
		return c.JSON(responses.CreateBillCustomizationResponse(DAO.FindFirstByTenant(*user.CompanyID)))
	}
}

// findById récupère une personnalisation de facture par son ID
// @Summary Récupère une personnalisation de facture par ID
// @Tags Bill Customization
// @Produce json
// @Param id path string true "ID de la personnalisation"
// @Success 200 {object} responses.BillCustomizationResponse "Personnalisation de facture"
// @Failure 400 {object} string "Aucun ID fourni"
// @Failure 401 {object} string "Non autorisé"
// @Router /bill-customization/{id} [get]
func findById(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		return c.JSON(responses.CreateBillCustomizationResponse(DAO.FindOneByIdAndTenant(id, *user.CompanyID)))
	}
}

// update met à jour une personnalisation de facture par son ID
// @Summary Met à jour une personnalisation de facture
// @Tags Bill Customization
// @Accept json
// @Produce json
// @Param id path string true "ID de la personnalisation"
// @Param customization body requests.BillCustomizationRequest true "Données de la personnalisation"
// @Success 200 {object} responses.BillCustomizationResponse "Personnalisation mise à jour"
// @Failure 400 {object} string "Aucun ID fourni ou corps mal formé"
// @Failure 401 {object} string "Non autorisé"
// @Router /bill-customization/{id} [patch]
func update(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBillCustomization := requests.BillCustomizationRequest{}
	if id := c.Params("id", ""); id == "" {
		return fiber.NewError(400, "No id provided")
	} else {
		if err := c.BodyParser(&newBillCustomization); err != nil {
			return fiber.NewError(400, fmt.Sprintln("Malformed body : ", err.Error()))
		}
		return c.JSON(responses.CreateBillCustomizationResponse(DAO.Update(id, *user.CompanyID, newBillCustomization)))
	}
}

// delete supprime une personnalisation de facture par son ID
// @Summary Supprime une personnalisation de facture
// @Tags Bill Customization
// @Param id path string true "ID de la personnalisation"
// @Success 204 {string} string "Personnalisation supprimée"
// @Failure 400 {object} string "Aucun ID fourni"
// @Failure 401 {object} string "Non autorisé"
// @Router /bill-customization/{id} [delete]
func delete(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	if id := c.Params("id", ""); id == "" {
		return c.Status(400).SendString("No id provided")

	} else {

		DAO.Delete(id, user.Email)
		return c.Status(204).SendString("BillCustomization deleted")
	}
}

// create crée une nouvelle personnalisation de facture
// @Summary Crée une personnalisation de facture
// @Tags Bill Customization
// @Accept json
// @Produce json
// @Param customization body requests.BillCustomizationRequest true "Données de la personnalisation"
// @Success 201 {object} responses.BillCustomizationResponse "Personnalisation créée"
// @Failure 400 {object} string "Corps mal formé"
// @Failure 401 {object} string "Non autorisé"
// @Router /bill-customization [post]
func create(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	newBillCustomization := requests.BillCustomizationRequest{}
	if err := c.BodyParser(&newBillCustomization); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse{Code: 400, Message: fmt.Sprintln("Malformed body : ", err.Error())})
	}

	return c.JSON(responses.CreateBillCustomizationResponse(DAO.Create(*user.CompanyID, newBillCustomization)))
}
