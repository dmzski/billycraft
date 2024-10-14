package dtos

import "time"

type ProductGroup struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CompanyID string    `json:"companyId"`
	CreatedBy string    `json:"createdBy"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}
