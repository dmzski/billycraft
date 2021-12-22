package models

import "backv2/internal/lib/dtos"

type BillLine struct {
	BillID      string `gorm:"primaryKey;autoIncrement:false"`
	Line        int    `gorm:"primaryKey;autoIncrement:false"`
	Quantity    float64
	Price       float64
	Name        string
	Description string
	Type        string
	Bill        Bill
}

func (BillLine) TableName() string {
	return "com_bill_line"
}

func (line BillLine) ToDTO() dtos.BillLine {
	return dtos.BillLine{
		BillID:      line.BillID,
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
	}
}

func (BillLine) FromDTO(line dtos.BillLine) BillLine {
	return BillLine{
		BillID:      line.BillID,
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
	}
}
