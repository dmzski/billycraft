package models

import "back/internal/lib/dtos"

type QuoteLine struct {
	QuoteID     string `gorm:"primaryKey"`
	Line        int    `gorm:"primaryKey"`
	Quantity    float64
	Price       float64
	Name        string
	Description *string
	Type        string
  ProductID   *string
}

func (QuoteLine) TableName() string {
	return "com_quote_line"
}

func (line QuoteLine) ToDTO() dtos.QuoteLine {
	return dtos.QuoteLine{
		QuoteID:     line.QuoteID,
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
    ProductID:   line.ProductID,
	}
}

func (QuoteLine) FromDTO(line dtos.QuoteLine) QuoteLine {
	return QuoteLine{
		QuoteID:     line.QuoteID,
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
    ProductID:   line.ProductID,
	}
}
