package requests

type MultipleBillPdfRequest struct {
	BillIds []string `json:"billIds"`
}//@name MultipleBillPdfRequest

type MultipleQuotePdfRequest struct {
	QuoteIds []string `json:"quoteIds"`
}//@name MultipleQuotePdfRequest
