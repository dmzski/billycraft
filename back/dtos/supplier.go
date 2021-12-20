package dtos

type SupplierResponse struct {
	ID        int64   `json:"id"`
	Name      string  `json:"name"`
	Color     *string `json:"color"`
	CompanyID int     `json:"companyId"`
	CreatedBy string  `json:"createdBy"`
}

type SupplierRequest struct {
	Name  string  `json:"name"`
	Color *string `json:"color"`
}
