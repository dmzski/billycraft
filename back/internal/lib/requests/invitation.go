package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

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

func MarshalInvitationRequest(req InvitationRequest) models.Invitation {
	i := models.Invitation{}
	i.Status = enums.InvitationStatusPending
	i.CompanyID = ""
	i.CreatedAt = time.Now()
	i.Email = req.Email
	i.Role = req.Role
	return i

}
