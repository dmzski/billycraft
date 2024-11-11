package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
)

type RoleResponse struct {
	Email string         `json:"email"`
	Role  enums.RoleEnum `json:"role"`
}

func CreateRoleResponse(r models.Role) RoleResponse {
	return RoleResponse{
		Email: r.Email,
		Role:  r.Role,
	}
}
