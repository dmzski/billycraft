package requests

import (
	"back/internal/lib/models"
	"time"
)

type OutgoingRequest struct {
	Name      *string               `json:"name"`
	StartDate *time.Time            `json:"startDate"`
	EndDate   *time.Time            `json:"endDate"`
	Lines     []OutgoingLineRequest `json:"lines"`
}

type OutgoingLineRequest struct {
	Line                  int     `json:"line"`
	SupplierID            *string `json:"supplierId"`
	SupplierBillReference *string `json:"supplierBillReference"`
	BillID                *string `json:"billId"`
	TotalHT               float64 `json:"totalHT"`
	VAT                   float32 `json:"vat"`
}

func MarshalOutgoingRequest(r OutgoingRequest) models.Outgoing {
	outgoing := models.Outgoing{
		Lines: make([]models.OutgoingLine, 0),
	}

	if r.Name != nil {
		outgoing.Name = *r.Name
	}

	if r.StartDate != nil {
		outgoing.StartDate = r.StartDate.Local()
	}
	if r.EndDate != nil {
		outgoing.EndDate = r.EndDate.Local()
	}

	for _, line := range r.Lines {
		outgoing.Lines = append(outgoing.Lines, models.OutgoingLine{
			SupplierID:            line.SupplierID,
			BillID:                line.BillID,
			SupplierBillReference: line.SupplierBillReference,
			TotalHT:               line.TotalHT,
			VAT:                   line.VAT,
			Line:                  line.Line,
		})
	}

	return outgoing
}

func MarshalOutgoingLineRequest(r OutgoingLineRequest) models.OutgoingLine {
	line := models.OutgoingLine{
		SupplierID:            r.SupplierID,
		BillID:                r.BillID,
		SupplierBillReference: r.SupplierBillReference,
		TotalHT:               r.TotalHT,
		VAT:                   r.VAT,
		Line:                  r.Line,
	}

	return line
}
