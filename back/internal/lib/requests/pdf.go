package requests

type MultipleBillPdfRequest struct {
	BillIds []string `json:"billIds"`
}

type MultipleQuotePdfRequest struct {
	QuoteIds []string `json:"quoteIds"`
}
