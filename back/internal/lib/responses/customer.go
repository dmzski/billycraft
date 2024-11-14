package responses

import (
	"back/internal/lib/models"
	"time"
)

type CustomerResponse struct {
  ID          string     `json:"id" validate:"required"`
  Name        string     `json:"name" validate:"required"`
  Contact     string     `json:"contact" validate:"required"`
  PhoneNumber string     `json:"phoneNumber" validate:"required"`
  City        string     `json:"city" validate:"required"`
  PostalCode  string     `json:"postalCode" validate:"required"`
  Address     string     `json:"address" validate:"required"`
  Email       string     `json:"email" validate:"required"`
  CreatedAt   time.Time  `json:"createdAt" validate:"required"`
	UpdatedAt   *time.Time `json:"updatedAt"`
  Deleted     bool       `json:"deleted" validate:"required"`
  CompanyID   string     `json:"companyId" validate:"required"`
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
