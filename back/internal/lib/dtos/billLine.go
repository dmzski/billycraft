package dtos

import "back/internal/lib/enums"

type BillLine struct {
	BillID      string            `json:"billId"`
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}
