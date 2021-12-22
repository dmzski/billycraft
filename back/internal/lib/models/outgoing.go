package models

import (
	"backv2/internal/lib/dtos"
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
	OutgoingID            string
	SupplierID            int64
	BillID                *string
	SupplierBillReference *string
	TotalHT               float64
	VAT                   int
}

func (Outgoing) TableName() string {
	return "com_outgoing"
}

func (o *Outgoing) BeforeCreate(tx *gorm.DB) (err error) {
	o.ID = uuid.New().String()
	return
}

func (Outgoing) FromDTO(r dtos.OutgoingRequest) Outgoing {
	outgoing := Outgoing{
		Name:      r.Name,
		StartDate: r.StartDate.Local(),
		EndDate:   r.EndDate.Local(),
		Lines:     make([]OutgoingLine, 0),
	}

	for _, line := range r.Lines {
		outgoing.Lines = append(outgoing.Lines, OutgoingLine{
			SupplierID:            line.SupplierID,
			BillID:                line.BillID,
			SupplierBillReference: line.SupplierBillReference,
			TotalHT:               line.TotalHT,
			VAT:                   line.VAT,
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
		})
	}

	return dto
}
