package dtos

import "time"

type CompanyResponse struct {
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
	ArticlesTax *float32   `json:"articlesTax"`
	ServicesTax *float32   `json:"servicesTax"`
	OthersTax   *float32   `json:"othersTax"`
}

type CompanyRequest struct {
	Name        string   `json:"name"`
	City        string   `json:"city"`
	Address     string   `json:"address"`
	PostalCode  string   `json:"postalCode"`
	PhoneNumber string   `json:"phoneNumber"`
	Logo        *string  `json:"logo"`
	Siret       string   `json:"siret"`
	Email       string   `json:"email"`
	ArticlesTax *float32 `json:"articlesTax"`
	ServicesTax *float32 `json:"servicesTax"`
	OthersTax   *float32 `json:"othersTax"`
}
