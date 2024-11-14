package responses

import (
	"back/internal/lib/models"
	"time"
)


type BillCustomizationResponse struct {
  ID                         string     `json:"id" validate:"required"`
  CompanyID                  string     `json:"companyId" validate:"required"`
  AfterTable                 string     `json:"afterTable" validate:"required"`
  Footer                     string     `json:"footer" validate:"required"`
  MainColor                  string     `json:"mainColor" validate:"required"`
  DisplayCompanyEmail        bool       `json:"displayCompanyEmail" validate:"required"`
  DisplayCompanyPhoneNumber  bool       `json:"displayCompanyPhoneNumber" validate:"required"`
  DisplayCustomerEmail       bool       `json:"displayCustomerEmail" validate:"required"`
  DisplayCustomerPhoneNumber bool       `json:"displayCustomerPhoneNumber" validate:"required"`
	CreatedAt                  time.Time  `json:"createdAt"`
	UpdatedAt                  *time.Time `json:"updatedAt"`
}//@name BillCustomizationResponse

type BillEmailCustomizationResponse struct {
  ID                string `json:"id" validate:"required"`
  Body              string `json:"body" validate:"required"`
  Object            string `json:"object" validate:"required"`
  SendAutomatically bool   `json:"sendAutomatically" validate:"required"`
  CompanyID         string `json:"companyId" validate:"required"`
}//@name BillEmailCustomizationResponse 

type QuoteCustomizationResponse struct {
  ID                         string     `json:"id" validate:"required"`
  CompanyID                  string     `json:"companyId" validate:"required"`
  AfterTable                 string     `json:"afterTable" validate:"required"`
  Footer                     string     `json:"footer" validate:"required"`
  MainColor                  string     `json:"mainColor" validate:"required"`
  DisplayCompanyEmail        bool       `json:"displayCompanyEmail" validate:"required"`
  DisplayCompanyPhoneNumber  bool       `json:"displayCompanyPhoneNumber" validate:"required"`
  DisplayCustomerEmail       bool       `json:"displayCustomerEmail" validate:"required"`
  DisplayCustomerPhoneNumber bool       `json:"displayCustomerPhoneNumber" validate:"required"`
  CreatedAt                  time.Time  `json:"createdAt" validate:"required"`
	UpdatedAt                  *time.Time `json:"updatedAt"`
}//@name QuoteCustomizationResponse

type QuoteEmailCustomizationResponse struct {
  ID                string `json:"id" validate:"required"`
  Body              string `json:"body" validate:"required"`
  Object            string `json:"object" validate:"required"`
  SendAutomatically bool   `json:"sendAutomatically" validate:"required"`
  CompanyID         string `json:"companyId" validate:"required"`
}//@name QuoteEmailCustomizationResponse

func CreateQuoteCustomizationResponse(q models.QuoteCustomization) QuoteCustomizationResponse {
	return QuoteCustomizationResponse{
		ID:                         q.ID,
		CompanyID:                  q.CompanyID,
		AfterTable:                 q.AfterTable,
		Footer:                     q.Footer,
		MainColor:                  q.MainColor,
		DisplayCompanyEmail:        q.DisplayCompanyEmail,
		DisplayCompanyPhoneNumber:  q.DisplayCompanyPhoneNumber,
		DisplayCustomerEmail:       q.DisplayCustomerEmail,
		DisplayCustomerPhoneNumber: q.DisplayCustomerPhoneNumber,
		CreatedAt:                  q.CreatedAt,
		UpdatedAt:                  q.UpdatedAt,
	}
}

func CreateQuoteEmailCustomizationResponse(q models.QuoteEmailCustomization) QuoteEmailCustomizationResponse {
	return QuoteEmailCustomizationResponse{
		ID:                q.ID,
		Body:              q.Body,
		Object:            q.Object,
		SendAutomatically: q.SendAutomatically,
		CompanyID:         q.CompanyID,
	}
}

func CreateBillCustomizationResponse(q models.BillCustomization) BillCustomizationResponse {
	return BillCustomizationResponse{
		ID:                         q.ID,
		CompanyID:                  q.CompanyID,
		AfterTable:                 q.AfterTable,
		Footer:                     q.Footer,
		MainColor:                  q.MainColor,
		DisplayCompanyEmail:        q.DisplayCompanyEmail,
		DisplayCompanyPhoneNumber:  q.DisplayCompanyPhoneNumber,
		DisplayCustomerEmail:       q.DisplayCustomerEmail,
		DisplayCustomerPhoneNumber: q.DisplayCustomerPhoneNumber,
		CreatedAt:                  q.CreatedAt,
		UpdatedAt:                  q.UpdatedAt,
	}
}

func CreateBillEmailCustomizationResponse(b models.BillEmailCustomization) BillEmailCustomizationResponse {
	return BillEmailCustomizationResponse{
		ID:                b.ID,
		Body:              b.Body,
		Object:            b.Object,
		SendAutomatically: b.SendAutomatically,
		CompanyID:         b.CompanyID,
	}
}
