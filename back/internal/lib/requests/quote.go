package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type UpdateQuoteRequest struct {
	Title      string             `json:"title" validate:"required"`
	Tva        *float32           `json:"tva"`
	Status     *enums.QuoteStatus `json:"status"`
	CustomerID *string            `json:"customerId"`
	Lines      []QuoteLineRequest `json:"lines" validate:"required"`
} //@name UpdateQuoteRequest

type CreateQuoteRequest struct {
	Title      string             `json:"title" validate:"required"`
	Tva        *float32           `json:"tva"`
	CustomerID *string            `json:"customerId"`
	Lines      []QuoteLineRequest `json:"lines" validate:"required"`
} //@name CreateQuoteRequest

type QuoteLineRequest struct {
	Line        int               `json:"line" validate:"required"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name" validate:"required"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type" validate:"required"`
	ProductID   *string           `json:"productId"`
} //@name QuoteLineRequest

type ListQuotesParams struct {
	Status    []enums.QuoteStatus `query:"status"`
	NotStatus []enums.QuoteStatus `query:"not_status"`
} //@name ListQuotesParams

func MarshalCreateQuoteRequest(req CreateQuoteRequest) models.Quote {
	lines := []models.QuoteLine{}
	for _, x := range req.Lines {
		lines = append(lines, MarshalQuoteLineRequest(x))
	}
	return models.Quote{
		Title:      req.Title,
		Tva:        req.Tva,
		CustomerID: req.CustomerID,
		Lines:      lines,
	}
}

func MarshalUpdateQuoteRequest(req UpdateQuoteRequest) models.Quote {
	lines := []models.QuoteLine{}
	for _, x := range req.Lines {
		lines = append(lines, MarshalQuoteLineRequest(x))
	}
	return models.Quote{
		Title:      req.Title,
		Tva:        req.Tva,
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
