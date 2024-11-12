package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type RoleRequest struct {
	Email string         `json:"email"`
	Role  enums.RoleEnum `json:"role"`
}//@name RoleRequest

func MarshalRoleRequest(dto RoleRequest) models.Role {
	return models.Role{
		Role:  dto.Role,
		Email: dto.Email,
	}
}
