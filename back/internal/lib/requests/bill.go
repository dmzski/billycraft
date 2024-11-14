package requests

import (
	"back/internal/lib/enums"
)

type BillRequest struct {
	Title      string            `json:"title" validate:"required"`
	Tva        *float32          `json:"tva"`
	Status     *enums.BillStatus `json:"status"`
	CustomerID *string           `json:"customerId"`
	Lines      []BillLineRequest `json:"lines" validate:"required"`
} //@name BillRequest

type BillLineRequest struct {
	Line        int               `json:"line" validate:"required"`
	Quantity    float64          `json:"quantity"`
	Price       float64          `json:"price"`
	Name        string            `json:"name" validate:"required"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type" validate:"required"`
	ProductID   *string           `json:"productId"`
} //@name BillLineRequest
