package main

import (
	"coco-erp/pdf-service/config"
	"coco-erp/pdf-service/database"
	"coco-erp/pdf-service/handlers"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	app := fiber.New()

	app.Use(logger.New())

	// Root API route
	api := app.Group("/api") // /api

	// API v1 routes
	v1 := api.Group("/v1") // /api/v1
	pdfRouter := v1.Group("/pdfs")
	handlers.SetupPDFRoutes(pdfRouter)

	c := config.GetConfiguration()

	database.GetConn()
	log.Fatal(app.Listen(fmt.Sprintf(":%s", c.Port)))
}
