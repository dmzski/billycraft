package main

import (
	"back/config"
	"back/database"
	"back/internal/api"
	"back/internal/lib/dtos"
	"back/internal/lib/oidc"
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
	} else {
		app.Use(recover.New(recover.Config{
			EnableStackTrace: true,
		}))
	}
	app.Use(cors.New())
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "${pid} ${locals:requestid} ${status} ${method} ${path}\n",
	}))
	app.Use(oidc.New(oidc.OidcConfig{
		AuthServerURL: config.OIDCAuthServerUrl,
		ClientID:      config.OIDCCLientId,
		ClientSecret:  config.OIDCClientSecret,
	}))
	api.InitApiRoutes(app)
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
		log.Panicln(err)
		panic("Failed to migrate database")
	}
	fmt.Println("Migrations successuffly applied")
}
