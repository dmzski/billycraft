package models

import (
	"back/internal/lib/dtos"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Outgoing struct {
	ID        string `gorm:"primaryKey"`
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
	StartDate time.Time
	EndDate   time.Time
	CreatedBy string
	CompanyID int
	Lines     []OutgoingLine
}

type OutgoingLine struct {
	OutgoingID            string `gorm:"primaryKey"`
	Line                  int    `gorm:"primaryKey"`
	SupplierID            *int64
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

func (o *Outgoing) BeforeCreate(tx *gorm.DB) (err error) {
	o.ID = uuid.New().String()
	return
}

func (Outgoing) FromDTO(r dtos.OutgoingRequest) Outgoing {
	outgoing := Outgoing{
		Lines: make([]OutgoingLine, 0),
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
		outgoing.Lines = append(outgoing.Lines, OutgoingLine{
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

func (o Outgoing) ToDTO() dtos.OutgoingResponse {

	dto := dtos.OutgoingResponse{
		ID:        o.ID,
		CreatedBy: o.CreatedBy,
		CompanyID: o.CompanyID,
		Name:      o.Name,
		StartDate: o.StartDate,
		EndDate:   o.EndDate,
		Lines:     make([]dtos.OutgoingLineResponse, 0),
	}

	for _, line := range o.Lines {
		dto.Lines = append(dto.Lines, dtos.OutgoingLineResponse{
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

func (OutgoingLine) FromDTO(r dtos.OutgoingLineRequest) OutgoingLine {
	line := OutgoingLine{
		SupplierID:            r.SupplierID,
		BillID:                r.BillID,
		SupplierBillReference: r.SupplierBillReference,
		TotalHT:               r.TotalHT,
		VAT:                   r.VAT,
		Line:                  r.Line,
	}

	return line
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
