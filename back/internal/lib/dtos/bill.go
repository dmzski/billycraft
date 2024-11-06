package dtos

import (
	"back/internal/lib/enums"
	"time"
)

type Bill struct {
	ID         string            `json:"id"`
	Title      string            `json:"title"`
	Name       string            `json:"name"`
	Tva        *float32          `json:"tva"`
	CreatedAt  time.Time         `json:"createdAt"`
	UpdatedAt  *time.Time        `json:"updatedAt"`
	PaidAt     *time.Time        `json:"paidAt"`
	SentAt     *time.Time        `json:"sentAt"`
	Status     *enums.BillStatus `json:"status"`
	CreatedBy  string            `json:"createdBy"`
	CompanyID  string            `json:"companyId"`
	CustomerID *string           `json:"customerId"`
	FileName   *string           `json:"fileName"`
	Lines      []BillLine        `json:"lines"`
}
