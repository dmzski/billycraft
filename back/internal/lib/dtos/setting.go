package dtos

import "time"

type Setting struct {
	ID        string     `json:"id"`
	Value     string     `json:"value"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
	CompanyID string     `json:"companyId"`
}
