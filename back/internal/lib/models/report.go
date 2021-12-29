package models

import "back/internal/lib/dtos"

type Report struct {
	ID             string `gorm:"primaryKey"`
	StartDate      string
	EndDate        string
	Sales          float64
	ArticleSales   float64
	ServiceSales   float64
	OtherSales     float64
	ArticleTaxes   float64
	ServiceTaxes   float64
	OtherTaxes     float64
	Outgoings      float64
	Bills          []Bill     `gorm:"many2many:com_report_bills;foreignKey:ID;joinForeignKey:ReportID;References:ID;joinReferences:BillID"`
	OutgoingsRefer []Outgoing `gorm:"many2many:com_report_outgoings;foreignKey:ID;joinForeignKey:ReportID;References:ID;joinReferences:OutgoingID"`
}

func (Report) TableName() string {
	return "com_report"
}

func (r Report) ToDTO() dtos.ReportResponse {
	return dtos.ReportResponse{
		ID:           r.ID,
		StartDate:    r.StartDate,
		EndDate:      r.EndDate,
		Sales:        r.Sales,
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
}
