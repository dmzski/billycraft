package enums

type InvitationStatusEnum string

const (
	InvitationStatusPending  InvitationStatusEnum = "PENDING"
	InvitationStatusAccepted InvitationStatusEnum = "ACCEPTED"
	InvitationStatusRefused  InvitationStatusEnum = "REFUSED"
)
