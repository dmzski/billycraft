package models

import (
	"time"
)

type Report struct {
	ID              string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
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
	ID         string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	OutgoingID string
	ReportID   string
	Name       string
	StartDate  time.Time
	EndDate    time.Time
	CreatedBy  string
	Lines      []ReportOutgoingLine
}

type ReportBill struct {
	ID           string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
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

func (ReportOutgoing) TableName() string {
	return "com_report_outgoing"
}

func (ReportOutgoingLine) TableName() string {
	return "com_report_outgoing_lines"
}

func (ReportBill) TableName() string {
	return "com_report_bill"
}
