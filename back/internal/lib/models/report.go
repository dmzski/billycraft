package models

import (
	"back/internal/lib/dtos"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Report struct {
	ID             string `gorm:"primaryKey"`
	Name           string
	StartDate      time.Time
	EndDate        time.Time
	ArticleSales   float64
	ServiceSales   float64
	OtherSales     float64
	ArticleTaxes   float64
	ServiceTaxes   float64
	OtherTaxes     float64
	Outgoings      float64
	CompanyID      int
	CreatedBy      string
	CreatedAt      time.Time
	UpdatedAt      time.Time
	Bills          []Bill     `gorm:"many2many:com_report_bills;foreignKey:ID;joinForeignKey:ReportID;References:ID;joinReferences:BillID"`
	OutgoingsRefer []Outgoing `gorm:"many2many:com_report_outgoings;foreignKey:ID;joinForeignKey:ReportID;References:ID;joinReferences:OutgoingID"`
}

func (Report) TableName() string {
	return "com_report"
}

func (r *Report) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New().String()
	return
}

func (r Report) ToDTO() dtos.ReportResponse {
	dto := dtos.ReportResponse{
		ID:           r.ID,
		Name:         r.Name,
		StartDate:    r.StartDate,
		EndDate:      r.EndDate,
		Sales:        r.ArticleSales + r.ServiceSales + r.OtherSales,
		ArticleSales: r.ArticleSales,
		ServiceSales: r.ServiceSales,
		OtherSales:   r.OtherSales,
		ArticleTaxes: r.ArticleTaxes,
		ServiceTaxes: r.ServiceTaxes,
		OtherTaxes:   r.OtherTaxes,
		Outgoings:    r.Outgoings,
		BillIDs:      make([]string, 0),
		OutgoingIDs:  make([]string, 0),
	}
	for _, bill := range r.Bills {
		dto.BillIDs = append(dto.BillIDs, bill.ID)
	}
	for _, outgoing := range r.OutgoingsRefer {
		dto.OutgoingIDs = append(dto.OutgoingIDs, outgoing.ID)
	}

	return dto
}
