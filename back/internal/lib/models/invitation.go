package models

import (
	"back/internal/lib/dtos"
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

func (i Invitation) ToDTO() dtos.InvitationResponse {
	return dtos.InvitationResponse{
		Role:      i.Role,
		Email:     i.Email,
		CreatedAt: i.CreatedAt,
		Status:    i.Status,
	}
}

func (i *Invitation) FromDTO(dto dtos.InvitationRequest) {
	i.Status = enums.InvitationStatusPending
	i.CompanyID = ""
	i.CreatedAt = time.Now()
	i.Email = dto.Email
	i.Role = dto.Role
}
