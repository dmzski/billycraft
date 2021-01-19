package models

import (
	"encoding/json"
	"io"
)

type Customer struct {
	ID          int64
	Name        string
	Address     string
	Contact     string
	Email       string
	PhoneNumber string
	PostalCode  string
	City        string
}

func (Customer) TableName() string {
	return "compta.com_customer"
}

func (c *Customer) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(c)
}

type Customers []*Customer

func (c *Customers) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(c)
}

func (c *Customer) FromJSON(reader io.Reader) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(c)
}
