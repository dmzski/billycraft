package models

import (
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
)

type Role struct {
	CompanyID string `gorm:"primaryKey;<-:create"`
	Email     string `gorm:"primaryKey;<-:create"`
	Role      enums.RoleEnum
}

func (Role) TableName() string {
	return "com_role"
}

func (r Role) ToDTO() dtos.RoleResponse {
	return dtos.RoleResponse{
		Email: r.Email,
		Role:  r.Role,
	}
}

func (r *Role) FromDTO(dto dtos.RoleRequest) {
	r.Role = dto.Role
	r.Email = dto.Email
}
