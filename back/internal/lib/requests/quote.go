package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type UpdateQuoteRequest struct {
	Title      string             `json:"title"`
	Name       string             `json:"name"`
	Tva        *float32           `json:"tva"`
	Status     enums.QuoteStatus  `json:"status"`
	CustomerID *string            `json:"customerId"`
	Lines      []QuoteLineRequest `json:"lines"`
}//@name UpdateQuoteRequest

type CreateQuoteRequest struct {
	Title      string             `json:"title"`
	Name       string             `json:"name"`
	Tva        *float32           `json:"tva"`
	Status     enums.QuoteStatus  `json:"status"`
	CustomerID *string            `json:"customerId"`
	Lines      []QuoteLineRequest `json:"lines"`
}//@name CreateQuoteRequest

type QuoteLineRequest struct {
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}//@name QuoteLineRequest

func MarshalCreateQuoteRequest(req CreateQuoteRequest) models.Quote {
	lines := []models.QuoteLine{}
	for _, x := range req.Lines {
		lines = append(lines, MarshalQuoteLineRequest(x))
	}
	return models.Quote{
		Name:       req.Name,
		Title:      req.Title,
		Tva:        req.Tva,
		Status:     req.Status,
		CustomerID: req.CustomerID,
		Lines:      lines,
	}
}

func MarshalUpdateQuoteRequest(req CreateQuoteRequest) models.Quote {
	lines := []models.QuoteLine{}
	for _, x := range req.Lines {
		lines = append(lines, MarshalQuoteLineRequest(x))
	}
	return models.Quote{
		Name:       req.Name,
		Title:      req.Title,
		Tva:        req.Tva,
		Status:     req.Status,
		CustomerID: req.CustomerID,
		Lines:      lines,
	}
}

func MarshalQuoteLineRequest(line QuoteLineRequest) models.QuoteLine {
	return models.QuoteLine{
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
		ProductID:   line.ProductID,
	}
}
