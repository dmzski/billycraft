package models

import (
	"encoding/json"
	"io"
)

type QuoteLine struct {
	Line        int8
	QuoteID     string
	Description string
	Quantity    float32
	Price       float64
}

func (QuoteLine) TableName() string {
	return "compta.com_quote_line"
}

func (ql *QuoteLine) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(ql)
}

type QuoteLines []*QuoteLine

func (ql *QuoteLines) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(ql)
}

func (ql *QuoteLine) FromJSON(reader io.Reader) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(ql)
}
