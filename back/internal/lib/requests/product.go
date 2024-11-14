package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type UpdateStockMovement struct {
	Quantity  float64 `json:"quantity" validate:"required"`
	ProductID string  `json:"productId" validate:"required"`
}//@name UpdateStockMovement

type UpdateStockRequest struct {
	InMovements  []UpdateStockMovement `json:"in" validate:"required"`
	OutMovements []UpdateStockMovement `json:"out" validate:"required"`
}//@name UpdateStockRequest

type CreateProductRequest struct {
	Type        enums.ProductType `json:"type" validate:"required"`
	Name        string            `json:"name" validate:"required"`
	Description *string           `json:"description"`
	Price       *float64          `json:"price"`
	Stock       *float64          `json:"stock"`
	Code        *string           `json:"code"`
	SupplierID  *string           `json:"supplierId"`
	GroupID     *string           `json:"groupId"`
	LowStock    *float64          `json:"lowStock"`
	StockAlert  bool              `json:"stockAlert"`
}//@name CreateProductRequest

type UpdateProductRequest struct {
	Type        enums.ProductType `json:"type" validate:"required"`
	Name        string            `json:"name" validate:"required"`
	Description *string           `json:"description"`
	Price       *float64          `json:"price"`
	Stock       *float64          `json:"stock"`
	Code        *string           `json:"code"`
	SupplierID  *string           `json:"supplierId"`
	GroupID     *string           `json:"groupId"`
	LowStock    *float64          `json:"lowStock"`
	StockAlert  bool              `json:"stockAlert"`
}//@name UpdateProductRequest

func MarshalCreateProductRequest(p CreateProductRequest) models.Product {
	return models.Product{
		Type:        p.Type,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		Stock:       p.Stock,
		Code:        p.Code,
		SupplierID:  p.SupplierID,
		GroupID:     p.GroupID,
		LowStock:    p.LowStock,
		StockAlert:  p.StockAlert,
	}
}

func MarshalUpdateProductRequest(p CreateProductRequest) models.Product {
	return models.Product{
		Type:        p.Type,
		Name:        p.Name,
		Description: p.Description,
		Price:       p.Price,
		Stock:       p.Stock,
		Code:        p.Code,
		SupplierID:  p.SupplierID,
		GroupID:     p.GroupID,
		LowStock:    p.LowStock,
		StockAlert:  p.StockAlert,
	}
}
