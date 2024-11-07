package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"slices"
)

type UserResponse struct {
	Email     string         `json:"email"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	CompanyID *string        `json:"companyId"`
	Role      enums.RoleEnum `json:"role"`
}

func CreateUserResponse(u models.User) UserResponse {
  r := UserResponse{
    CompanyID: u.CompanyID,
    Email: u.Email,
    LastName: u.LastName,
    FirstName: u.FirstName,
    Role: enums.RoleEnumViewer,
  }

	roleIndex := slices.IndexFunc(u.Roles, func(aRole *models.Role) bool {
		return aRole.CompanyID == *u.CompanyID
	})
	if roleIndex > -1 {
		r.Role = u.Roles[roleIndex].Role
	}

  return r
}
