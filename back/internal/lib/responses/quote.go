package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

type QuoteResponse struct {
  ID         string              `json:"id" validate:"required"`
  Title      string              `json:"title" validate:"required"`
  Name       string              `json:"name" validate:"required"`
	Tva        *float32            `json:"tva"`
  CreatedAt  time.Time           `json:"createdAt" validate:"required"`
	UpdatedAt  *time.Time          `json:"updatedAt"`
	SentAt     *time.Time          `json:"sentAt"`
  Status     enums.QuoteStatus   `json:"status" validate:"required"`
  CreatedBy  string              `json:"createdBy" validate:"required"`
  CompanyID  string              `json:"companyId" validate:"required"`
	CustomerID *string             `json:"customerId"`
	FileName   *string             `json:"fileName"`
  Lines      []QuoteLineResponse `json:"lines" validate:"required"`
}//@name QuoteResponse

type QuoteLineResponse struct {
  QuoteID     string            `json:"quoteId" validate:"required"`
  Line        int               `json:"line" validate:"required"`
  Quantity    float64           `json:"quantity" validate:"required"`
  Price       float64           `json:"price" validate:"required"`
  Name        string            `json:"name" validate:"required"`
	Description *string           `json:"description"`
  Type        enums.ProductType `json:"type" validate:"required"`
	ProductID   *string           `json:"productId"`
}//@name QuoteLineResponse

type QuoteResponseList struct {
  Quotes     []QuoteResponse `json:"quotes" validate:"required"`
  TotalCount int             `json:"totalCount" validate:"required"`
}//@name QuoteResponseList

func createQuoteLineResponse(line models.QuoteLine) QuoteLineResponse {
	return QuoteLineResponse{
		QuoteID:     line.QuoteID,
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
		ProductID:   line.ProductID,
	}
}

func CreateQuoteResponse(quote models.Quote) QuoteResponse {
	lines := []QuoteLineResponse{}
	for _, x := range quote.Lines {
		lines = append(lines, createQuoteLineResponse(x))
	}
	return QuoteResponse{
		ID:         quote.ID,
		Name:       quote.Name,
		Title:      quote.Title,
		Tva:        quote.Tva,
		CreatedAt:  quote.CreatedAt,
		UpdatedAt:  quote.UpdatedAt,
		SentAt:     quote.SentAt,
		Status:     quote.Status,
		CreatedBy:  quote.CreatedBy,
		CompanyID:  quote.CompanyID,
		CustomerID: quote.CustomerID,
		FileName:   quote.FileName,
		Lines:      lines,
	}
}

func CreateQuoteResponseList(quotes []models.Quote) QuoteResponseList {
	list := []QuoteResponse{}
	for _, quote := range quotes {
		list = append(list, CreateQuoteResponse(quote))
	}

	return QuoteResponseList{
		Quotes:     list,
		TotalCount: len(list),
	}

}
