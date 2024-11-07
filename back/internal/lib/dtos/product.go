package dtos

import "back/internal/lib/enums"

type Product struct {
	ID          string            `json:"id"`
	Type        enums.ProductType `json:"type"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Price       *float64          `json:"price"`
	Stock       *float64          `json:"stock"`
	Code        *string           `json:"code"`
	CompanyID   string            `json:"companyId"`
	CreatedBy   string            `json:"createdBy"`
	SupplierID  *string           `json:"supplierId"`
	GroupID     *string           `json:"groupId"`
	LowStock    *float64          `json:"lowStock"`
	StockAlert  bool              `json:"stockAlert"`
}
