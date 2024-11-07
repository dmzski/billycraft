package models

import (
	"back/internal/lib/enums"
	"time"
)

type Invitation struct {
	CompanyID string    `gorm:"primaryKey;<-:create"`
	Email     string    `gorm:"primaryKey;<-:create"`
	CreatedAt time.Time `gorm:"<-:false"`
	UpdatedAt time.Time `gorm:"<-:false;autoUpdateTime"`
	Status    enums.InvitationStatusEnum
	Role      enums.RoleEnum `gorm:"<-:create"`
}

func (Invitation) TableName() string {
	return "com_invitation"
}
