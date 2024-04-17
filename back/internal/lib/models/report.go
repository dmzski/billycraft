package models

import (
	"back/internal/lib/dtos"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Report struct {
	ID              string `gorm:"primaryKey"`
	Name            string
	StartDate       time.Time
	EndDate         time.Time
	ArticleSales    float64
	ServiceSales    float64
	OtherSales      float64
	ArticleTaxes    float64
	ServiceTaxes    float64
	OtherTaxes      float64
	Outgoings       float64
	CompanyID       string
	CreatedBy       string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	ReportBills     []ReportBill
	ReportOutgoings []ReportOutgoing
}

type ReportOutgoingLine struct {
	ReportOutgoingID      string `gorm:"primaryKey"`
	Line                  int    `gorm:"primaryKey"`
	SupplierID            *string
	BillID                *string
	SupplierBillReference *string
	TotalHT               float64
	VAT                   float32
}

type ReportOutgoing struct {
	ID         string `gorm:"primaryKey"`
	OutgoingID string
	ReportID   string
	Name       string
	StartDate  time.Time
	EndDate    time.Time
	CreatedBy  string
	Lines      []ReportOutgoingLine
}

type ReportBill struct {
	ID           string `gorm:"primaryKey"`
	Title        string
	BillID       string
	PaidAt       time.Time
	SentAt       time.Time
	ArticleSales float64
	ServiceSales float64
	OtherSales   float64
	ArticleTaxes float64
	ServiceTaxes float64
	OtherTaxes   float64
	Outgoings    float64
	CreatedBy    string
	ReportID     string
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
		ID:             r.ID,
		Name:           r.Name,
		CreatedAt:      r.CreatedAt,
		StartDate:      r.StartDate,
		EndDate:        r.EndDate,
		Sales:          r.ArticleSales + r.ServiceSales + r.OtherSales,
		ArticleSales:   r.ArticleSales,
		ServiceSales:   r.ServiceSales,
		OtherSales:     r.OtherSales,
		ArticleTaxes:   r.ArticleTaxes,
		ServiceTaxes:   r.ServiceTaxes,
		OtherTaxes:     r.OtherTaxes,
		TotalOutgoings: r.Outgoings,
		Bills:          make([]dtos.ReportBillResponse, 0),
		Outgoings:      make([]dtos.ReportOutgoingResponse, 0),
	}
	for _, bill := range r.ReportBills {
		dto.Bills = append(dto.Bills, bill.ToDTO())
	}
	for _, outgoing := range r.ReportOutgoings {
		dto.Outgoings = append(dto.Outgoings, outgoing.ToDTO())
	}

	return dto
}


func (ReportOutgoing) TableName() string {
	return "com_report_outgoing"
}

func (r *ReportOutgoing) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New().String()
	return
}

func (r ReportOutgoing) ToDTO() dtos.ReportOutgoingResponse {
	dto := dtos.ReportOutgoingResponse{
		OutgoingID: r.ID,
		Name:       r.Name,
		StartDate:  r.StartDate,
		EndDate:    r.EndDate,
		Lines:      make([]dtos.ReportOutgoingLineResponse, 0),
	}

	for _, line := range r.Lines {
		dto.Lines = append(dto.Lines, line.ToDTO())
	}
	return dto
}


func (ReportOutgoingLine) TableName() string {
	return "com_report_outgoing_lines"
}

func (r ReportOutgoingLine) ToDTO() dtos.ReportOutgoingLineResponse {
	dto := dtos.ReportOutgoingLineResponse{
		Line:                  r.Line,
		SupplierID:            r.SupplierID,
		BillID:                r.BillID,
		SupplierBillReference: r.SupplierBillReference,
		TotalHT:               r.TotalHT,
		VAT:                   r.VAT,
	}

	return dto
}


func (ReportBill) TableName() string {
	return "com_report_bill"
}

func (r *ReportBill) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New().String()
	return
}

func (r ReportBill) ToDTO() dtos.ReportBillResponse {
	dto := dtos.ReportBillResponse{
		Title:        r.Title,
		BillID:       r.BillID,
		PaidAt:       r.PaidAt,
		SentAt:       r.SentAt,
		ArticleSales: r.ArticleSales,
		ServiceSales: r.ServiceSales,
		OtherSales:   r.OtherSales,
		ArticleTaxes: r.ArticleTaxes,
		ServiceTaxes: r.ServiceTaxes,
		OtherTaxes:   r.OtherTaxes,
		CreatedBy:    r.CreatedBy,
	}

	return dto
}
