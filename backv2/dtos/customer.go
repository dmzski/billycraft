package dtos

import "time"

type Customer struct {
	ID          int64      `json:"id"`
	Name        string     `json:"name"`
	Contact     string     `json:"contact"`
	PhoneNumber string     `json:"phoneNumber"`
	City        string     `json:"city"`
	PostalCode  string     `json:"postalCode"`
	Address     string     `json:"address"`
	Email       string     `json:"email"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
	CompanyID   int        `json:"companyId"`
}
