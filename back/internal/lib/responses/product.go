package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type ProductResponse struct {
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
