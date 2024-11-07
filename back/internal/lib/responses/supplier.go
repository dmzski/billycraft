package responses

import "back/internal/lib/models"

type SupplierResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Color     *string `json:"color"`
	CompanyID string  `json:"companyId"`
	Vat       float32 `json:"vat"`
	CreatedBy string  `json:"createdBy"`
}

func CreateSupplierResponse(supplier models.Supplier) SupplierResponse {
	return SupplierResponse{
		ID:        supplier.ID,
		Name:      supplier.Name,
		Color:     supplier.Color,
		Vat:       supplier.Vat,
		CompanyID: supplier.CompanyID,
		CreatedBy: supplier.CreatedBy,
	}
}
