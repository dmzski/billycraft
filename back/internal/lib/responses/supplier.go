package responses

import "back/internal/lib/models"

type SupplierResponse struct {
  ID        string  `json:"id" validate:"required"`
  Name      string  `json:"name" validate:"required"`
	Color     *string `json:"color"`
  CompanyID string  `json:"companyId" validate:"required"`
  Vat       float32 `json:"vat" validate:"required"`
  CreatedBy string  `json:"createdBy" validate:"required"`
}//@name SupplierResponse

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
