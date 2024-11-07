package enums

type QuoteStatus string

const (
	QuoteStatusDraft    QuoteStatus = "DRAFT"
	QuoteStatusSent     QuoteStatus = "SENT"
	QuoteStatusRefused  QuoteStatus = "REFUSED"
	QuoteStatusAccepted QuoteStatus = "ACCEPTED"
	QuoteStatusArchived QuoteStatus = "ARCHIVED"
)

func (s QuoteStatus) IsEditable() bool {
	return s == QuoteStatusDraft
}

func (s QuoteStatus) IsDuplicable() bool {
	return s == QuoteStatusRefused || s == QuoteStatusArchived
}

func (s QuoteStatus) CanBeSent() bool {
	return s == QuoteStatusDraft
}

func (s QuoteStatus) CanBeAccepted() bool {
	return s == QuoteStatusSent
}

func (s QuoteStatus) CanBeRefused() bool {
	return s == QuoteStatusSent
}

func (s QuoteStatus) CanBeArchived() bool {
	return s == QuoteStatusAccepted
}
