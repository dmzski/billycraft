package responses

import (
	"back/internal/lib/models"
	"time"
)

type OrganizationResponse struct {
	ID              string     `json:"id"`
	Name            string     `json:"name"`
	City            string     `json:"city"`
	Address         string     `json:"address"`
	PostalCode      string     `json:"postalCode"`
	PhoneNumber     string     `json:"phoneNumber"`
	Logo            *string    `json:"logo"`
	Siret           string     `json:"siret"`
	Email           string     `json:"email"`
	CreatedBy       string     `json:"createdBy"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       *time.Time `json:"updatedAt"`
	ArticlesTax     *float32   `json:"articlesTax"`
	ServicesTax     *float32   `json:"servicesTax"`
	OthersTax       *float32   `json:"othersTax"`
	AutoMonthReport bool       `json:"autoMonthReport"`
	AutoYearReport  bool       `json:"autoYearReport"`
	VatPercent      float32    `json:"vatPercent"`
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
