package models

import (
	"regexp"
	"strings"
)

type User struct {
	email     string
	firstName string
	lastName  string
	companyID int64
}

type Tabler interface {
	TableName() string
}

// TableName overrides the table name used by User to `profiles`
func (User) TableName() string {
	return "compta.com_users"
}

// TableName overrides the table name used by User to `profiles`
func (User) ColumnName(table, column string) string {
	column = regexp.MustCompile("([a-z0-9])([A-Z])").ReplaceAllString(column, "${1}_${2}")
	return strings.ToLower(column)
}
