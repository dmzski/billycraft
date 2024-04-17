package dtos

type Product struct {
	ID          string   `json:"id"`
	Type        string   `json:"type"`
	Name        string   `json:"name"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price"`
	CompanyID   string   `json:"companyId"`
	CreatedBy   string   `json:"createdBy"`
}
