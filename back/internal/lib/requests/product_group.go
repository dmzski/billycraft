package requests

type ProductGroupUpdateRequest struct {
	Name string `json:"name" validate:"required"`
}//@name ProductGroupUpdateRequest

type ProductGroupCreateRequest struct {
	Name string `json:"name" validate:"required"`
}//@name ProductGroupCreateRequest
