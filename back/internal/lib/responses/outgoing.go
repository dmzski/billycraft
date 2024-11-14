package responses

import (
	"back/internal/lib/models"
	"time"
)

type OutgoingResponse struct {
  ID        string                 `json:"id" validate:"required"`
  Name      string                 `json:"name" validate:"required"`
  StartDate time.Time              `json:"startDate" validate:"required"`
  EndDate   time.Time              `json:"endDate" validate:"required"`
  Lines     []OutgoingLineResponse `json:"lines" validate:"required"`
  CompanyID string                 `json:"companyId" validate:"required"`
  CreatedBy string                 `json:"createdBy" validate:"required"`
}//@name OutgoingResponse

type OutgoingLineResponse struct {
  Line                  int     `json:"line" validate:"required"`
	SupplierID            *string `json:"supplierId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	BillID                *string `json:"billId"`
  TotalHT               float64 `json:"totalHT" validate:"required"`
  VAT                   float32 `json:"vat" validate:"required"`
}//@name OutgoingLineResponse

func CreateOutgoingResponse(o models.Outgoing) OutgoingResponse {

	dto := OutgoingResponse{
		ID:        o.ID,
		CreatedBy: o.CreatedBy,
		CompanyID: o.CompanyID,
		Name:      o.Name,
		StartDate: o.StartDate,
		EndDate:   o.EndDate,
		Lines:     make([]OutgoingLineResponse, 0),
	}

	for _, line := range o.Lines {
		dto.Lines = append(dto.Lines, OutgoingLineResponse{
			SupplierID:            line.SupplierID,
			SupplierBillReference: line.SupplierBillReference,
			BillID:                line.BillID,
			TotalHT:               line.TotalHT,
			VAT:                   line.VAT,
			Line:                  line.Line,
		})
	}

	return dto
}
