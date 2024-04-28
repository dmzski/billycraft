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

func (r *UserResponse) FromModel(u models.User) {
	r.CompanyID = u.CompanyID
	r.Email = u.Email
	r.LastName = u.LastName
	r.FirstName = u.FirstName
	r.Role = enums.RoleEnumViewer

	roleIndex := slices.IndexFunc(u.Roles, func(aRole *models.Role) bool {
		return aRole.CompanyID == *u.CompanyID
	})
	if roleIndex > -1 {
		r.Role = u.Roles[roleIndex].Role
	}
}
