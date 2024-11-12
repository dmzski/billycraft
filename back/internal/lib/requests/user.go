package requests

import "back/internal/lib/enums"

type RemoveUserRequest struct {
	Email string `json:"email"`
}//@name RemoveUserRequest

type UserRequest struct {
	Email     string         `json:"email"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	CompanyID *string        `json:"companyId"`
	Role      enums.RoleEnum `json:"role"`
}//@name UserRequest
