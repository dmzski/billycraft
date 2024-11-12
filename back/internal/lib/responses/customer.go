package responses

import (
	"back/internal/lib/models"
	"time"
)

type CustomerResponse struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Contact     string     `json:"contact"`
	PhoneNumber string     `json:"phoneNumber"`
	City        string     `json:"city"`
	PostalCode  string     `json:"postalCode"`
	Address     string     `json:"address"`
	Email       string     `json:"email"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
	Deleted     bool       `json:"deleted"`
	CompanyID   string     `json:"companyId"`
}//@name CustomerResponse

func CreateCustomerResponse(c models.Customer) CustomerResponse {
	return CustomerResponse{
		ID:          c.ID,
		Name:        c.Name,
		Contact:     c.Contact,
		PhoneNumber: c.PhoneNumber,
		City:        c.City,
		PostalCode:  c.PostalCode,
		Address:     c.Address,
		Email:       c.Email,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
		CompanyID:   c.CompanyID,
		Deleted:     c.DeletedAt.Valid,
	}
}
