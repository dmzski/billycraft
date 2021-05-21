package models

import (
	"encoding/json"
	"io"
)

type Company struct {
	ID          uint64
	Name        string
	City        string
	Address     string
	PostalCode  string
	PhoneNumber string
	Logo        string
	Siret       string
	Email       string
}

func (Company) TableName() string {
	return "compta.com_company"
}

func (c *Company) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(c)
}

type Companies []*Company

func (c *Companies) ToJSON(writer io.Writer) error {
	encoder := json.NewEncoder(writer)
	return encoder.Encode(c)
}

func (c *Company) FromJSON(reader io.Reader) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(c)
}
