package requests

type MultipleBillPdfRequest struct {
	BillIds []string `json:"billIds"`
}
