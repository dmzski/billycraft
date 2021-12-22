package products

import (
	"gorm.io/gorm"
)

type Product struct {
	ID          int64 `gorm:"primaryKey;autoIncrement;<-:create"`
	Type        string
	Name        string
	Description *string
	Price       *float64
	CompanyID   int    `gorm:"<-:create"`
	CreatedBy   string `gorm:"foreignKey:Email;<-:create"`
}

func (p Product) TableName() string {
	return "com_product"
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = 0
	return
}

func (p Product) ToDTO() ProductDTO {
	return ProductDTO(p)
}

func (Product) FromDTO(p ProductDTO) Product {
	return Product(p)
}
