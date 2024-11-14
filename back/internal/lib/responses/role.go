package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type RoleResponse struct {
  Email string         `json:"email" validate:"required"`
  Role  enums.RoleEnum `json:"role" validate:"required"`
}//@name RoleResponse

func CreateRoleResponse(r models.Role) RoleResponse {
	return RoleResponse{
		Email: r.Email,
		Role:  r.Role,
	}
}
