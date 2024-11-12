package requests

import (
	"back/internal/lib/enums"
)

type BillRequest struct {
	Title      string            `json:"title"`
	Tva        *float32          `json:"tva"`
	Status     *enums.BillStatus `json:"status"`
	CompanyID  string            `json:"companyId"`
	CustomerID *string           `json:"customerId"`
	Lines      []BillLineRequest `json:"lines"`
}//@name BillRequest

type BillLineRequest struct {
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}//@name BillLineRequest
