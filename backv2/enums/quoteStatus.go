package enums

type QuoteStatus string

var QuoteEnums = map[string]QuoteStatus{
	"DRAFT":        "DRAFT",
	"SENT":         "SENT",
	"REFUSED":      "REFUSED",
	"ACCEPTED":     "ACCEPTED",
	"DEPOSIT_ASK":  "DEPOSIT_ASK",
	"DEPOSIT_PAID": "DEPOSIT_PAID",
	"ARCHIVED":     "ARCHIVED",
}

func (s QuoteStatus) IsGreaterThanOrEqualSent() bool {
	return s != "DRAFT"
}
