package requests

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

type InvitationFindAllParams struct {
	Status *enums.InvitationStatusEnum `query:"status"`
}//@name InvitationFindAllParams

type InvitationRequest struct {
	Email string         `json:"email"`
	Role  enums.RoleEnum `json:"role"`
}//@name InvitationRequest

type AcceptInvitationRequest struct {
	CompanyID string `json:"companyId"`
}//@name AcceptInvitationRequest

type RefuseInvitationRequest struct {
	CompanyID string `json:"companyId"`
}//@name RefuseInvitationRequest

type DeleteInvitationRequest struct {
	Email string `json:"email"`
}//@name DeleteInvitationRequest

func MarshalInvitationRequest(req InvitationRequest) models.Invitation {
	i := models.Invitation{}
	i.Status = enums.InvitationStatusPending
	i.CompanyID = ""
	i.CreatedAt = time.Now()
	i.Email = req.Email
	i.Role = req.Role
	return i

}
