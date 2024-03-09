package main

import (
	"back/config"
	"back/database"
	"back/internal/api"
	cocoCron "back/internal/cron"
	"back/internal/lib/dtos"
	"errors"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/golang-migrate/migrate/v4"
	"github.com/robfig/cron/v3"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

const MAX_RETRY_COUNT = 3

var retryCount = 0

func main() {
	var err error
	config, err := config.LoadConfig()
	if err != nil {
		log.Fatalln("Cannot load config:", err)
	}
	initDb(config)
	c := cron.New(cron.WithChain(
		cron.Recover(cron.DefaultLogger),
	))
	if config.Profile != "dev" {
		c.AddFunc("@monthly", cocoCron.LaunchMonthReportJob)
		c.AddFunc("@yearly", cocoCron.LaunchYearReportJob)
	}
	c.Start()
	defer c.Stop()

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
	api.InitApiRoutes(app)

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
		log.Fatalln("Failed to connect database")
		if retryCount == MAX_RETRY_COUNT {
			log.Fatalln("Cannot connect to DB after 3 retries")
			os.Exit(3)
		} else {
			log.Println("Retry database connection in 3 seconds")
			retryCount += 1
			time.AfterFunc(3*time.Second, func() {
				initDb(config)
			})
      return
		}
	}
	log.Println("Connection Opened to Database")
	err = database.MakeMigrations()
	if err != nil && err != migrate.ErrNoChange {
		log.Fatalln(err)
    os.Exit(3)
	}
	log.Println("Migrations successfully applied")
}
