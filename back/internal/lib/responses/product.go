package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type ProductResponse struct {
  ID          string            `json:"id" validate:"required"`
  Type        enums.ProductType `json:"type" validate:"required"`
  Name        string            `json:"name" validate:"required"`
	Description *string           `json:"description"`
	Price       *float64          `json:"price"`
	Stock       *float64          `json:"stock"`
	Code        *string           `json:"code"`
  CompanyID   string            `json:"companyId" validate:"required"`
  CreatedBy   string            `json:"createdBy" validate:"required"`
	SupplierID  *string           `json:"supplierId"`
	GroupID     *string           `json:"groupId"`
	LowStock    *float64          `json:"lowStock"`
  StockAlert  bool              `json:"stockAlert" validate:"required"`
}//@name ProductResponse

func CreateProductResponse(p models.Product) ProductResponse {
	return ProductResponse{
		ID:          p.ID,
		Type:        p.Type,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		Stock:       p.Stock,
		Code:        p.Code,
		CompanyID:   p.CompanyID,
		CreatedBy:   p.CreatedBy,
		SupplierID:  p.SupplierID,
		GroupID:     p.GroupID,
		LowStock:    p.LowStock,
		StockAlert:  p.StockAlert,
	}
}
