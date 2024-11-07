package dtos

import (
	"back/internal/lib/enums"
	"time"
)

type Quote struct {
	ID         string            `json:"id"`
	Title      string            `json:"title"`
	Name       string            `json:"name"`
	Tva        *float32          `json:"tva"`
	CreatedAt  time.Time         `json:"createdAt"`
	UpdatedAt  *time.Time        `json:"updatedAt"`
	SentAt     *time.Time        `json:"sentAt"`
	Status     enums.QuoteStatus `json:"status"`
	CreatedBy  string            `json:"createdBy"`
	CompanyID  string            `json:"companyId"`
	CustomerID *string           `json:"customerId"`
	FileName   *string           `json:"fileName"`
	Lines      []QuoteLine       `json:"lines"`
}
