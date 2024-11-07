package models

import (
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


