package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

type InvitationResponse struct {
  Email     string                     `json:"email" validate:"required"`
  CreatedAt time.Time                  `json:"createdAt" validate:"required"`
  Status    enums.InvitationStatusEnum `json:"status" validate:"required"`
  Role      enums.RoleEnum             `json:"role" validate:"required"`
}//@name InvitationResponse

type MyInvitationResponse struct {
  CompanyID   string                     `json:"companyId" validate:"required"`
  CompanyName string                     `json:"companyName" validate:"required"`
  CreatedAt   time.Time                  `json:"createdAt" validate:"required"`
  Status      enums.InvitationStatusEnum `json:"status" validate:"required"`
  Role        enums.RoleEnum             `json:"role" validate:"required"`
}//@name MyInvitationResponse

func CreateInvitationResponse(i models.Invitation) InvitationResponse {
	return InvitationResponse{
		Role:      i.Role,
		Email:     i.Email,
		CreatedAt: i.CreatedAt,
		Status:    i.Status,
	}
}
