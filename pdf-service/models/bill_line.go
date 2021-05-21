package models

import (
	"encoding/json"
	"io"
)

type BillLine struct {
	Line        int8
	QuoteID     string
	Description string
	Quantity    float32
	Price       float64
}

func (BillLine) TableName() string {
	return "compta.com_quote_line"
}

func (ql *BillLine) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(ql)
}

type BillLines []*BillLine

func (ql *BillLines) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(ql)
}

func (ql *BillLine) FromJSON(reader io.Reader) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(ql)
}
