package requests

import "back/internal/lib/models"

type SupplierRequest struct {
	Name  string  `json:"name" validate:"required"`
	Color *string `json:"color"`
	Vat   float32 `json:"vat" validate:"required"`
}//@name SupplierRequest

func MarshalSupplierRequest(req SupplierRequest) models.Supplier {
	return models.Supplier{
		Name:  req.Name,
		Color: req.Color,
		Vat:   req.Vat,
	}
}
