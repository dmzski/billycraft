package models

import "back/internal/lib/dtos"

type BillLine struct {
	BillID      string `gorm:"primaryKey"`
	Line        int    `gorm:"primaryKey"`
	Quantity    float64
	Price       float64
	Name        string
	Description *string
	Type        string
  ProductID   *string
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
    ProductID:   line.ProductID,
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
    ProductID:   line.ProductID,
	}
}
