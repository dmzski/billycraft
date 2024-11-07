package responses

import (
	"back/internal/lib/enums"
	"time"
)

type BillResponse struct {
	ID         string             `json:"id"`
	Title      string             `json:"title"`
	Name       string             `json:"name"`
	Tva        *float32           `json:"tva"`
	CreatedAt  time.Time          `json:"createdAt"`
	UpdatedAt  *time.Time         `json:"updatedAt"`
	PaidAt     *time.Time         `json:"paidAt"`
	SentAt     *time.Time         `json:"sentAt"`
	Status     *enums.BillStatus  `json:"status"`
	CreatedBy  string             `json:"createdBy"`
	CompanyID  string             `json:"companyId"`
	CustomerID *string            `json:"customerId"`
	FileName   *string            `json:"fileName"`
	Lines      []BillLineResponse `json:"lines"`
}

type BillLineResponse struct {
	BillID      string            `json:"billId"`
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}
