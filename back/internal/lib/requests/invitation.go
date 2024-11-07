package requests

import "back/internal/lib/enums"

type InvitationFindAllParams struct {
	Status *enums.InvitationStatusEnum `query:"status"`
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
