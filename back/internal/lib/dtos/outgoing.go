package dtos

import "time"

type OutgoingResponse struct {
	ID        string                 `json:"id"`
	Name      string                 `json:"name"`
	StartDate time.Time              `json:"startDate"`
	EndDate   time.Time              `json:"endDate"`
	Lines     []OutgoingLineResponse `json:"lines"`
	CompanyID int                    `json:"companyId"`
	CreatedBy string                 `json:"createdBy"`
}

type OutgoingLineResponse struct {
	SupplierID            int64   `json:"supplierId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	BillID                *string `json:"billId"`
	TotalHT               float64 `json:"totalHT"`
	VAT                   int     `json:"tva"`
}

type OutgoingRequest struct {
	Name      string                `json:"name"`
	StartDate time.Time             `json:"startDate"`
	EndDate   time.Time             `json:"endDate"`
	Lines     []OutgoingLineRequest `json:"lines"`
}

type OutgoingLineRequest struct {
	SupplierID            int64   `json:"supplierId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	BillID                *string `json:"billId"`
	TotalHT               float64 `json:"totalHT"`
	VAT                   int     `json:"tva"`
}
