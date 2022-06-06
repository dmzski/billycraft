package dtos

type SupplierResponse struct {
	ID        int64   `json:"id"`
	Name      string  `json:"name"`
	Color     *string `json:"color"`
	CompanyID int     `json:"companyId"`
	Vat       float32 `json:"vat"`
	CreatedBy string  `json:"createdBy"`
}

type SupplierRequest struct {
	Name  string  `json:"name"`
	Color *string `json:"color"`
	Vat   float32 `json:"vat"`
}
