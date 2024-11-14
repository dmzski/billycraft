package requests

import "back/internal/lib/enums"

type RemoveUserRequest struct {
	Email string `json:"email" validate:"required"`
}//@name RemoveUserRequest

type UserRequest struct {
	Email     string         `json:"email" validate:"required"`
	FirstName string         `json:"firstName" validate:"required"`
	LastName  string         `json:"lastName" validate:"required"`
	CompanyID *string        `json:"companyId"`
	Role      enums.RoleEnum `json:"role" validate:"required"`
}//@name UserRequest
