package responses

import (
	"back/internal/lib/models"
	"time"
)


type BillCustomizationResponse struct {
	ID                         string     `json:"id"`
	CompanyID                  string     `json:"companyId"`
	AfterTable                 string     `json:"afterTable"`
	Footer                     string     `json:"footer"`
	MainColor                  string     `json:"mainColor"`
	DisplayCompanyEmail        bool       `json:"displayCompanyEmail"`
	DisplayCompanyPhoneNumber  bool       `json:"displayCompanyPhoneNumber"`
	DisplayCustomerEmail       bool       `json:"displayCustomerEmail"`
	DisplayCustomerPhoneNumber bool       `json:"displayCustomerPhoneNumber"`
	CreatedAt                  time.Time  `json:"createdAt"`
	UpdatedAt                  *time.Time `json:"updatedAt"`
}//@name BillCustomizationResponse

type BillEmailCustomizationResponse struct {
	ID                string `json:"id"`
	Body              string `json:"body"`
	Object            string `json:"object"`
	SendAutomatically bool   `json:"sendAutomatically"`
	CompanyID         string `json:"companyId"`
}//@name BillEmailCustomizationResponse 

type QuoteCustomizationResponse struct {
	ID                         string     `json:"id"`
	CompanyID                  string     `json:"companyId"`
	AfterTable                 string     `json:"afterTable"`
	Footer                     string     `json:"footer"`
	MainColor                  string     `json:"mainColor"`
	DisplayCompanyEmail        bool       `json:"displayCompanyEmail"`
	DisplayCompanyPhoneNumber  bool       `json:"displayCompanyPhoneNumber"`
	DisplayCustomerEmail       bool       `json:"displayCustomerEmail"`
	DisplayCustomerPhoneNumber bool       `json:"displayCustomerPhoneNumber"`
	CreatedAt                  time.Time  `json:"createdAt"`
	UpdatedAt                  *time.Time `json:"updatedAt"`
}//@name QuoteCustomizationResponse

type QuoteEmailCustomizationResponse struct {
	ID                string `json:"id"`
	Body              string `json:"body"`
	Object            string `json:"object"`
	SendAutomatically bool   `json:"sendAutomatically"`
	CompanyID         string `json:"companyId"`
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
