package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

type QuoteResponse struct {
	ID         string              `json:"id"`
	Title      string              `json:"title"`
	Name       string              `json:"name"`
	Tva        *float32            `json:"tva"`
	CreatedAt  time.Time           `json:"createdAt"`
	UpdatedAt  *time.Time          `json:"updatedAt"`
	SentAt     *time.Time          `json:"sentAt"`
	Status     enums.QuoteStatus   `json:"status"`
	CreatedBy  string              `json:"createdBy"`
	CompanyID  string              `json:"companyId"`
	CustomerID *string             `json:"customerId"`
	FileName   *string             `json:"fileName"`
	Lines      []QuoteLineResponse `json:"lines"`
}//@name QuoteResponse

type QuoteLineResponse struct {
	QuoteID     string            `json:"quoteId"`
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}//@name QuoteLineResponse

type QuoteResponseList struct {
	Quotes     []QuoteResponse `json:"quotes"`
	TotalCount int             `json:"totalCount"`
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
