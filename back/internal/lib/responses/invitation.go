package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

type InvitationResponse struct {
	Email     string                     `json:"email"`
	CreatedAt time.Time                  `json:"createdAt"`
	Status    enums.InvitationStatusEnum `json:"status"`
	Role      enums.RoleEnum             `json:"role"`
}//@name InvitationResponse

type MyInvitationResponse struct {
	CompanyID   string                     `json:"companyId"`
	CompanyName string                     `json:"companyName"`
	CreatedAt   time.Time                  `json:"createdAt"`
	Status      enums.InvitationStatusEnum `json:"status"`
	Role        enums.RoleEnum             `json:"role"`
}//@name MyInvitationResponse

func CreateInvitationResponse(i models.Invitation) InvitationResponse {
	return InvitationResponse{
		Role:      i.Role,
		Email:     i.Email,
		CreatedAt: i.CreatedAt,
		Status:    i.Status,
	}
}
