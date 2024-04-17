package dtos

type SupplierResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Color     *string `json:"color"`
	CompanyID string  `json:"companyId"`
	Vat       float32 `json:"vat"`
	CreatedBy string  `json:"createdBy"`
}

type SupplierRequest struct {
	Name  string  `json:"name"`
	Color *string `json:"color"`
	Vat   float32 `json:"vat"`
}
