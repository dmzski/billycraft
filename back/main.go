package main

import (
	"backv2/appointments"
	"backv2/billCustomization"
	"backv2/billEmailCustomization"
	"backv2/bills"
	"backv2/company"
	"backv2/config"
	"backv2/customers"
	"backv2/database"
	"backv2/dtos"
	"backv2/logo"
	"backv2/oidc"
	"backv2/pdf"
	"backv2/products"
	"backv2/quoteCustomization"
	"backv2/quoteEmailCustomization"
	"backv2/quotes"
	"backv2/reports"
	"backv2/todos"
	"backv2/users"
	"errors"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/golang-migrate/migrate/v4"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

func main() {
	var err error
	config, err := config.LoadConfig()
	if err != nil {
		log.Println("cannot load config:", err)
	}

	app := fiber.New(fiber.Config{
		// Override default error handler
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			// Status code defaults to 500
			code := fiber.StatusInternalServerError

			// Retrieve the custom status code if it's an fiber.*Error
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			if errors.Is(err, gorm.ErrRecordNotFound) {
				code = fiber.StatusNotFound
			}

			// Send custom error page
			err = ctx.Status(code).JSON(dtos.Error{Code: code, Message: err.Error()})
			if err != nil {
				// In case the SendFile fails
				return ctx.Status(500).SendString("Internal Server Error")
			}

			// Return from handler
			return nil
		},
	})
	if config.Profile != "dev" {
		app.Use(recover.New())
	}
	app.Use(cors.New())
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "${pid} ${locals:requestid} ${status} - ${method} ${path}​\n",
	}))
	app.Use(oidc.New(oidc.OidcConfig{
		AuthServerURL: config.OIDCAuthServerUrl,
		ClientID:      config.OIDCCLientId,
		ClientSecret:  config.OIDCClientSecret,
	}))
	setupRoutes(app)
	initDb(config)

	log.Fatal(app.Listen(config.ServerAddress))

}

func initDb(config config.Config) {
	var err error
	dbLogger := gormLogger.Default.LogMode(gormLogger.Silent)
	if config.Profile == "dev" {
		dbLogger = gormLogger.Default.LogMode(gormLogger.Info)
	}
	database.DBConn, err = gorm.Open(postgres.Open(config.DBSource), &gorm.Config{
		Logger: dbLogger,
	})

	if err != nil {
		panic("Failed to connect database")
	}
	fmt.Println("Connection Opened to Database")
	err = database.MakeMigrations()
	if err != nil && err != migrate.ErrNoChange {
		panic("Failed to migrate database")
	}
	fmt.Println("Migrations successuffly applied")
}

func setupRoutes(app *fiber.App) {
	log.Println("Setting up routes")
	api := app.Group("/api")
	v1 := api.Group("/v1", oidc.Secure())
	company.InitRoutes(v1)
	reports.InitRoutes(v1)
	customers.InitRoutes(v1)
	quotes.InitRoutes(v1)
	products.InitRoutes(v1)
	bills.InitRoutes(v1)
	users.InitRoutes(v1)
	quoteCustomization.InitRoutes(v1)
	billCustomization.InitRoutes(v1)
	quoteEmailCustomization.InitRoutes(v1)
	billEmailCustomization.InitRoutes(v1)
	pdf.InitRoutes(v1)
	todos.InitRoutes(v1)
	logo.InitRoutes(api)
	appointments.InitRoutes(api)
}
