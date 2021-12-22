package dtos

import "time"

type Company struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	City        string     `json:"city"`
	Address     string     `json:"address"`
	PostalCode  string     `json:"postalCode"`
	PhoneNumber string     `json:"phoneNumber"`
	Logo        *string    `json:"logo"`
	Siret       string     `json:"siret"`
	Email       string     `json:"email"`
	CreatedBy   string     `json:"createdBy"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
}
