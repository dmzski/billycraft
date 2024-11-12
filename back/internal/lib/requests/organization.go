package requests

import "back/internal/lib/models"

type OrganizationRequest struct {
	Name            string   `json:"name"`
	City            string   `json:"city"`
	Address         string   `json:"address"`
	PostalCode      string   `json:"postalCode"`
	PhoneNumber     string   `json:"phoneNumber"`
	Logo            *string  `json:"logo"`
	Siret           string   `json:"siret"`
	Email           string   `json:"email"`
	ArticlesTax     *float32 `json:"articlesTax"`
	ServicesTax     *float32 `json:"servicesTax"`
	OthersTax       *float32 `json:"othersTax"`
	AutoMonthReport *bool    `json:"autoMonthReport"`
	AutoYearReport  *bool    `json:"autoYearReport"`
	VatPercent      float32  `json:"vatPercent"`
}//@name OrganizationRequest

func MarshalOrganizationRequest(c OrganizationRequest) models.Organization {
	return models.Organization{
		Name:            c.Name,
		City:            c.City,
		Address:         c.Address,
		PostalCode:      c.PostalCode,
		PhoneNumber:     c.PhoneNumber,
		Logo:            c.Logo,
		Siret:           c.Siret,
		Email:           c.Email,
		ArticlesTax:     c.ArticlesTax,
		ServicesTax:     c.ServicesTax,
		OthersTax:       c.OthersTax,
		AutoMonthReport: c.AutoMonthReport,
		AutoYearReport:  c.AutoYearReport,
		VatPercent:      c.VatPercent,
	}

}
