package requests

import "back/internal/lib/enums"

type UpdateQuoteRequest struct {
	Title      string             `json:"title"`
	Name       string             `json:"name"`
	Tva        *float32           `json:"tva"`
	Status     enums.QuoteStatus  `json:"status"`
	CustomerID *string            `json:"customerId"`
	Lines      []QuoteLineRequest `json:"lines"`
}

type CreateQuoteRequest struct {
	Title      string             `json:"title"`
	Name       string             `json:"name"`
	Tva        *float32           `json:"tva"`
	Status     enums.QuoteStatus  `json:"status"`
	CustomerID *string            `json:"customerId"`
	Lines      []QuoteLineRequest `json:"lines"`
}

type QuoteLineRequest struct {
	Line        int     `json:"line"`
	Quantity    float64 `json:"quantity"`
	Price       float64 `json:"price"`
	Name        string  `json:"name"`
	Description *string `json:"description"`
	Type        string  `json:"type"`
	ProductID   *string `json:"productId"`
}
