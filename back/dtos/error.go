package dtos

import "github.com/gofiber/fiber/v2"

type Error struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e Error) send(c *fiber.Ctx) error {
	return c.Status(e.Code).JSON(e)
}
