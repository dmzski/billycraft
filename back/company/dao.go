package company

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/models"
)

type CompanyDao struct {
}

func (dao CompanyDao) FindOneById(id int) (company models.Company) {
	database.DBConn.Where("id = ?", id).First(&company)
	return
}

func (dao CompanyDao) Create(dto dtos.Company) (company models.Company) {
	tx := database.DBConn.Begin()
	company = company.FromDTO(dto)
	tx.Omit("ID").Create(&company)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Model(&models.User{}).Where("email = ?", company.CreatedBy).Update("company_id", company.ID)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

func (dao CompanyDao) Update(id int, dto dtos.Company) (company models.Company) {
	tx := database.DBConn.Begin()
	tx.Where("id = ?", id).First(&company)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Updates(&dto)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

var (
	DAO = &CompanyDao{}
)
