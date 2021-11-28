package enums

type BillStatus string

var BillEnums = map[string]BillStatus{
	"DRAFT":        "DRAFT",
	"SENT":         "SENT",
	"REFUSED":      "REFUSED",
	"ACCEPTED":     "ACCEPTED",
	"PAYMENT_ASK":  "PAYMENT_ASK",
	"PAYMENT_PAID": "PAYMENT_PAID",
	"ARCHIVED":     "ARCHIVED",
}

func (s BillStatus) IsGreaterThanOrEqualSent() bool {
	return s != "DRAFT"
}

func (s BillStatus) IsPaid() bool {
	return s != "DRAFT" && s != "SENT" && s != "REFUSED" && s != "ACCEPTED"
}
