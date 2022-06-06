package dtos

import (
	"time"
)

type Bill struct {
	ID         string     `json:"id"`
	Title      string     `json:"title"`
	Tva        *float32   `json:"tva"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  *time.Time `json:"updatedAt"`
	PaidAt     *time.Time `json:"paidAt"`
	SentAt     *time.Time `json:"sentAt"`
	Status     *string    `json:"status"`
	CreatedBy  string     `json:"createdBy"`
	CompanyID  int        `json:"companyId"`
	CustomerID *int       `json:"customerId"`
	FileName   *string    `json:"fileName"`
	Lines      []BillLine `json:"lines"`
}
