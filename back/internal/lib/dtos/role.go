package dtos

import "back/internal/lib/enums"

type RoleResponse struct {
	Email string         `json:"email"`
	Role  enums.RoleEnum `json:"role"`
}

type RoleRequest struct {
	Email string         `json:"email"`
	Role  enums.RoleEnum `json:"role"`
}
