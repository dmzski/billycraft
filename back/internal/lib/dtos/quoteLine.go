package dtos

import "back/internal/lib/enums"

type QuoteLine struct {
	QuoteID     string            `json:"quoteId"`
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}
