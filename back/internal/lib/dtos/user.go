package dtos

import "back/internal/lib/enums"

type User struct {
	Email     string         `json:"email"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	CompanyID *string        `json:"companyId"`
	Role      enums.RoleEnum `json:"role"`
}
