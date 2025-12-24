package enums

type BillStatus string //@name BillStatus

const (
	BillStatusDraft    BillStatus = "DRAFT"
	BillStatusSent     BillStatus = "SENT"
	BillStatusRefused  BillStatus = "REFUSED"
	BillStatusPaid     BillStatus = "PAID"
	BillStatusArchived BillStatus = "ARCHIVED"
)

func (s BillStatus) IsEditable() bool {
	return s == BillStatusDraft
}

func (s BillStatus) IsDuplicable() bool {
	return s == BillStatusRefused || s == BillStatusArchived
}

func (s BillStatus) CanBeSent() bool {
	return s == BillStatusDraft
}

func (s BillStatus) CanBePaid() bool {
	return s == BillStatusSent
}

func (s BillStatus) CanBeRefused() bool {
	return s == BillStatusSent
}

func (s BillStatus) CanBeArchived() bool {
	return s == BillStatusPaid
}
