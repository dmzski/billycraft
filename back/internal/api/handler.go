package api

import (
	"back/internal/api/billCustomization"
	"back/internal/api/billEmailCustomization"
	"back/internal/api/bills"
	"back/internal/api/company"
	"back/internal/api/customers"
	"back/internal/api/invitations"
	"back/internal/api/outgoings"
	"back/internal/api/pdf"
	"back/internal/api/product_groups"
	"back/internal/api/products"
	"back/internal/api/quoteCustomization"
	"back/internal/api/quoteEmailCustomization"
	"back/internal/api/quotes"
	"back/internal/api/reports"
	"back/internal/api/suppliers"
	"back/internal/api/todos"
	"back/internal/api/users"
	"back/internal/lib/auth"

	"github.com/gofiber/fiber/v2"
)

func InitApiRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1", auth.Secure())
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
	suppliers.InitRoutes(v1)
	outgoings.InitRoutes(v1)
	invitations.InitRoutes(v1)
	product_groups.InitRoutes(v1)
}
