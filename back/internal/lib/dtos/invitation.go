package dtos

import (
	"back/internal/lib/enums"
	"time"
)

type InvitationResponse struct {
	Email     string                     `json:"email"`
	CreatedAt time.Time                  `json:"createdAt"`
	Status    enums.InvitationStatusEnum `json:"status"`
	Role      enums.RoleEnum             `json:"role"`
}

type MyInvitationResponse struct {
	CompanyID   string                     `json:"companyId"`
	CompanyName string                     `json:"companyName"`
	CreatedAt   time.Time                  `json:"createdAt"`
	Status      enums.InvitationStatusEnum `json:"status"`
	Role        enums.RoleEnum             `json:"role"`
}

type InvitationRequest struct {
	Email string         `json:"email"`
	Role  enums.RoleEnum `json:"role"`
}

type AcceptInvitationRequest struct {
	CompanyID string `json:"companyId"`
}

type RefuseInvitationRequest struct {
	CompanyID string `json:"companyId"`
}
type DeleteInvitationRequest struct {
	Email string `json:"email"`
}
