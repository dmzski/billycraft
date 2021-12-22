package api

import (
	"backv2/internal/api/appointments"
	"backv2/internal/api/billCustomization"
	"backv2/internal/api/billEmailCustomization"
	"backv2/internal/api/bills"
	"backv2/internal/api/company"
	"backv2/internal/api/customers"
	"backv2/internal/api/logo"
	"backv2/internal/api/outgoings"
	"backv2/internal/api/pdf"
	"backv2/internal/api/products"
	"backv2/internal/api/quoteCustomization"
	"backv2/internal/api/quoteEmailCustomization"
	"backv2/internal/api/quotes"
	"backv2/internal/api/reports"
	"backv2/internal/api/suppliers"
	"backv2/internal/api/todos"
	"backv2/internal/api/users"
	"backv2/internal/lib/oidc"

	"github.com/gofiber/fiber/v2"
)

func InitApiRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1", oidc.Secure())
	// V1 Api Routes
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
	appointments.InitRoutes(v1)
	suppliers.InitRoutes(v1)
	outgoings.InitRoutes(v1)

	// Global API Routes
	logo.InitRoutes(api)
}
