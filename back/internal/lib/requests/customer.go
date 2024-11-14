package requests

type CustomerRequest struct {
	Name        string `json:"name" validate:"required"`
	Contact     string `json:"contact"`
	PhoneNumber string `json:"phoneNumber"`
	City        string `json:"city" validate:"required"`
	PostalCode  string `json:"postalCode" validate:"required"`
	Address     string `json:"address" validate:"required"`
	Email       string `json:"email"`
}//@name CustomerRequest
