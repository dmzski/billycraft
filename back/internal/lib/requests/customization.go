package requests

import (
	"back/internal/lib/models"
)

type BillCustomizationRequest struct {
	AfterTable                 string `json:"afterTable"`
	Footer                     string `json:"footer"`
	MainColor                  string `json:"mainColor"`
	DisplayCompanyEmail        bool   `json:"displayCompanyEmail"`
	DisplayCompanyPhoneNumber  bool   `json:"displayCompanyPhoneNumber"`
	DisplayCustomerEmail       bool   `json:"displayCustomerEmail"`
	DisplayCustomerPhoneNumber bool   `json:"displayCustomerPhoneNumber"`
}

type BillEmailCustomizationRequest struct {
	Body              string `json:"body"`
	Object            string `json:"object"`
	SendAutomatically bool   `json:"sendAutomatically"`
}

type QuoteCustomizationRequest struct {
	AfterTable                 string `json:"afterTable"`
	Footer                     string `json:"footer"`
	MainColor                  string `json:"mainColor"`
	DisplayCompanyEmail        bool   `json:"displayCompanyEmail"`
	DisplayCompanyPhoneNumber  bool   `json:"displayCompanyPhoneNumber"`
	DisplayCustomerEmail       bool   `json:"displayCustomerEmail"`
	DisplayCustomerPhoneNumber bool   `json:"displayCustomerPhoneNumber"`
}

type QuoteEmailCustomizationRequest struct {
	Body              string `json:"body"`
	Object            string `json:"object"`
	SendAutomatically bool   `json:"sendAutomatically"`
}

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
