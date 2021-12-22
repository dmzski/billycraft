package products

type ProductDTO struct {
	ID          int64    `json:"id"`
	Type        string   `json:"type"`
	Name        string   `json:"name"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price"`
	CompanyID   int      `json:"companyId"`
	CreatedBy   string   `json:"createdBy"`
}
