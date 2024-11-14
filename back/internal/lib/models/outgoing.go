package models

import (
	"time"
)

type Outgoing struct {
	ID        string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
	StartDate time.Time
	EndDate   time.Time
	CreatedBy string
	CompanyID string
	Lines     []OutgoingLine
}

type OutgoingLine struct {
	OutgoingID            string `gorm:"primaryKey"`
	Line                  int    `gorm:"primaryKey"`
	SupplierID            *string
	BillID                *string
	SupplierBillReference *string
	TotalHT               float64
	VAT                   float32
}

func (Outgoing) TableName() string {
	return "com_outgoing"
}

func (OutgoingLine) TableName() string {
	return "com_outgoing_lines"
}

func (o Outgoing) ToReport() ReportOutgoing {
	r := ReportOutgoing{
		OutgoingID: o.ID,
		Name:       o.Name,
		StartDate:  o.StartDate,
		EndDate:    o.EndDate,
		CreatedBy:  o.CreatedBy,
		Lines:      make([]ReportOutgoingLine, 0),
	}

	for _, line := range o.Lines {
		r.Lines = append(r.Lines, ReportOutgoingLine{
			ReportOutgoingID:      r.ID,
			Line:                  line.Line,
			SupplierID:            line.SupplierID,
			BillID:                line.BillID,
			SupplierBillReference: line.SupplierBillReference,
			TotalHT:               line.TotalHT,
			VAT:                   line.VAT,
		})
	}
	return r
}
