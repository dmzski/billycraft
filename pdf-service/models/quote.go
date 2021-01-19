package models

import (
	"encoding/json"
	"io"
)

//Quote struct
type Quote struct {
	ID         string
	Title      string
	Tva        int8
	CompanyID  int32
	CustomerID int
	Status     string
	FileName   string
	Customer   Customer
	Lines      []QuoteLine `gorm:"foreignKey:QuoteID"`
}

func (Quote) TableName() string {
	return "compta.com_quote"
}

func (c *Quote) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(c)
}

type Quotes []*Quote

func (q *Quotes) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(q)
}

func (q *Quote) FromJSON(reader io.Reader) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(q)
}
