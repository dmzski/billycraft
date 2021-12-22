package dtos

type OutgoingResponse struct {
	ID        int64                  `json:"id"`
	Name      string                 `json:"name"`
	StartDate *string                `json:"startDate"`
	EndDate   *string                `json:"endDate"`
	Lines     []OutgoingLineResponse `json:"lines"`
	CompanyID int                    `json:"companyId"`
	CreatedBy string                 `json:"createdBy"`
}

type OutgoingLineResponse struct {
	SupplierID            int64   `json:"supplierId"`
	SupplierBillReference string  `json:"supplierBillReference"`
	BillReference         string  `json:"billReference"`
	TotalHT               float64 `json:"totalHT"`
	TVA                   int     `json:"tva"`
}

type OutgoingRequest struct {
	Name      string                `json:"name"`
	StartDate *string               `json:"startDate"`
	EndDate   *string               `json:"endDate"`
	Lines     []OutgoingLineRequest `json:"lines"`
}

type OutgoingLineRequest struct {
	SupplierID    int64   `json:"supplierId"`
	BillReference string  `json:"billReference"`
	TotalHT       float64 `json:"totalHT"`
	TVA           int     `json:"tva"`
}
