package requests

type TodoRequest struct {
	Description string `json:"description" validate:"required"`
}//@name TodoRequest
