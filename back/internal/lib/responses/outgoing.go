package responses

import (
	"back/internal/lib/models"
	"time"
)

type OutgoingResponse struct {
	ID        string                 `json:"id"`
	Name      string                 `json:"name"`
	StartDate time.Time              `json:"startDate"`
	EndDate   time.Time              `json:"endDate"`
	Lines     []OutgoingLineResponse `json:"lines"`
	CompanyID string                 `json:"companyId"`
	CreatedBy string                 `json:"createdBy"`
}//@name OutgoingResponse

type OutgoingLineResponse struct {
	Line                  int     `json:"line"`
	SupplierID            *string `json:"supplierId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	BillID                *string `json:"billId"`
	TotalHT               float64 `json:"totalHT"`
	VAT                   float32 `json:"vat"`
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
