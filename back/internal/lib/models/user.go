package models

type User struct {
	Email     string `gorm:"primaryKey"`
	FirstName string
	LastName  string
	CompanyID *string
	Company   *Company
	Roles     []*Role `gorm:"foreignKey:Email;references:Email"`
}

func (User) TableName() string {
	return "com_user"
}
