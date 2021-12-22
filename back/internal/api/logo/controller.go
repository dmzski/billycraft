package logo

import (
	"back/config"
	"back/internal/lib/dtos"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func InitRoutes(api fiber.Router) {
	api.Get("/logo/:id", findMyLogo)
}

func findMyLogo(c *fiber.Ctx) error {
	companyId := c.Params("id")
	if companyId == "" {
		return c.Status(400).JSON(&dtos.Error{
			Code:    400,
			Message: "No id specified",
		})
	}

	return c.SendFile(config.Get().UploadDir + fmt.Sprintf("/%s/logo.png", companyId))
}
