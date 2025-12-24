package enums

type InvitationStatusEnum string //@name InvitationStatusEnum

const (
	InvitationStatusPending  InvitationStatusEnum = "PENDING"
	InvitationStatusAccepted InvitationStatusEnum = "ACCEPTED"
	InvitationStatusRefused  InvitationStatusEnum = "REFUSED"
)
