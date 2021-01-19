package models

import (
	"encoding/json"
	"io"
)

//Bill struct
type Bill struct {
	ID         string
	Title      string
	Tva        int8
	CompanyID  int32
	CustomerID int
	Status     string
	FileName   string
	Customer   Customer
	Lines      []BillLine `gorm:"foreignKey:BillID"`
}

func (Bill) TableName() string {
	return "compta.com_Bill"
}

func (c *Bill) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(c)
}

type Bills []*Bill

func (q *Bills) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(q)
}

func (q *Bill) FromJSON(reader io.Reader) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(q)
}
