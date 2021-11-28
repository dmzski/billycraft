package models

import "backv2/dtos"

type User struct {
	Email     string `gorm:"primaryKey"`
	FirstName string
	LastName  string
	CompanyID *int `gorm:"foreignKey:CreatedBy"`
	Company   *Company
}

func (User) TableName() string {
	return "com_user"
}

func (u User) ToDTO() dtos.User {
	return dtos.User{
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		CompanyID: u.CompanyID,
	}
}

func (User) FromDTO(u dtos.User) User {
	return User{
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		CompanyID: u.CompanyID,
	}
}
