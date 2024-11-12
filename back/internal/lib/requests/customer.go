package requests

type CustomerRequest struct {
	Name        string `json:"name"`
	Contact     string `json:"contact"`
	PhoneNumber string `json:"phoneNumber"`
	City        string `json:"city"`
	PostalCode  string `json:"postalCode"`
	Address     string `json:"address"`
	Email       string `json:"email"`
}//@name CustomerRequest
