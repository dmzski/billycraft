package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type RoleRequest struct {
	Email string         `json:"email" validate:"required"`
	Role  enums.RoleEnum `json:"role" validate:"required"`
}//@name RoleRequest

func MarshalRoleRequest(dto RoleRequest) models.Role {
	return models.Role{
		Role:  dto.Role,
		Email: dto.Email,
	}
}
