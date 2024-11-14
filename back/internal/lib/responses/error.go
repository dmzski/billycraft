package responses

type ErrorResponse struct {
  Code    int    `json:"code" validate:"required"`
  Message string `json:"message" validate:"required"`
}//@name ErrorResponse
