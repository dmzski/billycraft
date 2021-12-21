package models

import (
	"backv2/dtos"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Outgoing struct {
	ID        string `gorm:"primaryKey"`
	Title     string
	Tva       *int
	CreatedAt time.Time  `gorm`
	UpdatedAt *time.Time `gorm:"autoUpdateTime"`
	CreatedBy string
	CompanyID int
	Lines     []OutgoingLine
}

type OutgoingLine struct {
	OutgoingID            string
	SupplierID            int64
	BillReference         *string
	SupplierBillReference *string
	TotalHT               float64
	TVA                   int
}

func (Outgoing) TableName() string {
	return "com_outgoing"
}

func (o *Outgoing) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Omit(clause.Associations)
	o.ID = uuid.New().String()
	return
}

func (Outgoing) FromDTO(r dtos.OutgoingRequest) Outgoing {
	outgoing := Outgoing{
		CreatedBy:  b.CreatedBy,
		CompanyID:  b.CompanyID,
		CustomerID: b.CustomerID,
		FileName:   b.FileName,
		Lines:      make([]OutgoingLine, 0),
	}

	return outgoing
}

func (bill Outgoing) ToDTO() dtos.OutgoingResponse {
	lines := []dtos.OutgoingLineResponse{}
	for _, x := range bill.Lines {
		lines = append(lines, x.ToDTO())
	}
	return dtos.OutgoingResponse{
		ID:         bill.ID,
		Title:      bill.Title,
		Tva:        bill.Tva,
		CreatedAt:  bill.CreatedAt,
		UpdatedAt:  bill.UpdatedAt,
		PaidAt:     bill.PaidAt,
		SentAt:     bill.SentAt,
		Status:     &bill.Status,
		CreatedBy:  bill.CreatedBy,
		CompanyID:  bill.CompanyID,
		CustomerID: bill.CustomerID,
		FileName:   bill.FileName,
		Lines:      lines,
	}
}
