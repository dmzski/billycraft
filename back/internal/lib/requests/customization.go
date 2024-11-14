package requests

import (
	"back/internal/lib/models"
)

type BillCustomizationRequest struct {
	AfterTable                 string `json:"afterTable" validate:"required"`
	Footer                     string `json:"footer" validate:"required"`
	MainColor                  string `json:"mainColor" validate:"required"`
	DisplayCompanyEmail        bool   `json:"displayCompanyEmail" validate:"required"`
	DisplayCompanyPhoneNumber  bool   `json:"displayCompanyPhoneNumber" validate:"required"`
	DisplayCustomerEmail       bool   `json:"displayCustomerEmail" validate:"required"`
	DisplayCustomerPhoneNumber bool   `json:"displayCustomerPhoneNumber" validate:"required"`
}//@name BillCustomizationRequest

type BillEmailCustomizationRequest struct {
	Body              string `json:"body" validate:"required"`
	Object            string `json:"object" validate:"required"`
	SendAutomatically bool   `json:"sendAutomatically" validate:"required"`
}//@name BillEmailCustomizationRequest

type QuoteCustomizationRequest struct {
	AfterTable                 string `json:"afterTable" validate:"required"`
	Footer                     string `json:"footer" validate:"required"`
	MainColor                  string `json:"mainColor" validate:"required"`
	DisplayCompanyEmail        bool   `json:"displayCompanyEmail" validate:"required"`
	DisplayCompanyPhoneNumber  bool   `json:"displayCompanyPhoneNumber" validate:"required"`
	DisplayCustomerEmail       bool   `json:"displayCustomerEmail" validate:"required"`
	DisplayCustomerPhoneNumber bool   `json:"displayCustomerPhoneNumber" validate:"required"`
}//@name QuoteCustomizationRequest

type QuoteEmailCustomizationRequest struct {
	Body              string `json:"body" validate:"required"`
	Object            string `json:"object" validate:"required"`
	SendAutomatically bool   `json:"sendAutomatically" validate:"required"`
}//@name QuoteEmailCustomizationRequest

func MarshalQuoteCustomizationRequest(q QuoteCustomizationRequest) models.QuoteCustomization {
	return models.QuoteCustomization{
		AfterTable:                 q.AfterTable,
		Footer:                     q.Footer,
		MainColor:                  q.MainColor,
		DisplayCompanyEmail:        q.DisplayCompanyEmail,
		DisplayCompanyPhoneNumber:  q.DisplayCompanyPhoneNumber,
		DisplayCustomerEmail:       q.DisplayCustomerEmail,
		DisplayCustomerPhoneNumber: q.DisplayCustomerPhoneNumber,
	}
}

func MarshalQuoteEmailCustomizationRequest(q QuoteEmailCustomizationRequest) models.QuoteEmailCustomization {
	return models.QuoteEmailCustomization{
		Body:              q.Body,
		Object:            q.Object,
		SendAutomatically: q.SendAutomatically,
	}
}

func MarshalBillEmailCustomizationRequest(b BillEmailCustomizationRequest) models.BillEmailCustomization {
	return models.BillEmailCustomization{
		Body:              b.Body,
		Object:            b.Object,
		SendAutomatically: b.SendAutomatically,
	}
}

func MarshalBillCustomizationRequest(q BillCustomizationRequest) models.BillCustomization {
	return models.BillCustomization{
		AfterTable:                 q.AfterTable,
		Footer:                     q.Footer,
		MainColor:                  q.MainColor,
		DisplayCompanyEmail:        q.DisplayCompanyEmail,
		DisplayCompanyPhoneNumber:  q.DisplayCompanyPhoneNumber,
		DisplayCustomerEmail:       q.DisplayCustomerEmail,
		DisplayCustomerPhoneNumber: q.DisplayCustomerPhoneNumber,
	}
}
