package requests

type MultipleBillPdfRequest struct {
  BillIds []string `json:"billIds" validate:"required"`
}//@name MultipleBillPdfRequest

type MultipleQuotePdfRequest struct {
  QuoteIds []string `json:"quoteIds" validate:"required"`
}//@name MultipleQuotePdfRequest
