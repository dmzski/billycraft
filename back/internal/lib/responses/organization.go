package responses

import (
	"back/internal/lib/models"
	"time"
)

type OrganizationResponse struct {
  ID              string     `json:"id" validate:"required"`
  Name            string     `json:"name" validate:"required"`
  City            string     `json:"city" validate:"required"`
  Address         string     `json:"address" validate:"required"`
  PostalCode      string     `json:"postalCode" validate:"required"`
  PhoneNumber     string     `json:"phoneNumber" validate:"required"`
	Logo            *string    `json:"logo"`
  Siret           string     `json:"siret" validate:"required"`
  Email           string     `json:"email" validate:"required"`
  CreatedBy       string     `json:"createdBy" validate:"required"`
  CreatedAt       time.Time  `json:"createdAt" validate:"required"`
	UpdatedAt       *time.Time `json:"updatedAt"`
	ArticlesTax     *float32   `json:"articlesTax"`
	ServicesTax     *float32   `json:"servicesTax"`
	OthersTax       *float32   `json:"othersTax"`
  AutoMonthReport bool       `json:"autoMonthReport" validate:"required"`
  AutoYearReport  bool       `json:"autoYearReport" validate:"required"`
  VatPercent      float32    `json:"vatPercent" validate:"required"`
}//@name OrganizationResponse

func CreateOrganizationResponse(c models.Organization) OrganizationResponse {
	dto := OrganizationResponse{
		ID:              c.ID,
		Name:            c.Name,
		City:            c.City,
		Address:         c.Address,
		PostalCode:      c.PostalCode,
		PhoneNumber:     c.PhoneNumber,
		Logo:            c.Logo,
		Siret:           c.Siret,
		Email:           c.Email,
		CreatedBy:       c.CreatedBy,
		CreatedAt:       c.CreatedAt,
		UpdatedAt:       c.UpdatedAt,
		ArticlesTax:     c.ArticlesTax,
		ServicesTax:     c.ServicesTax,
		OthersTax:       c.OthersTax,
		AutoMonthReport: false,
		AutoYearReport:  false,
		VatPercent:      c.VatPercent,
	}

	if c.AutoMonthReport != nil {
		dto.AutoMonthReport = *c.AutoMonthReport
	}
	if c.AutoYearReport != nil {
		dto.AutoYearReport = *c.AutoYearReport
	}

	return dto
}
