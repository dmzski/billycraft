package company

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
)

type CompanyDao struct {
}

func (dao CompanyDao) FindAll() (companies []models.Company) {
	database.DBConn.Find(&companies)
	return
}

func (dao CompanyDao) FindAllForMonthCron() (companies []models.Company) {
	database.DBConn.Where("auto_month_report = true").Find(&companies)
	return
}
func (dao CompanyDao) FindAllForYearCron() (companies []models.Company) {
	database.DBConn.Where("auto_year_report = true").Find(&companies)
	return
}

func (dao CompanyDao) FindOneById(id string) (company models.Company) {
	database.DBConn.Where("id = ?", id).First(&company)
	return
}

func (dao CompanyDao) Create(creator string, dto dtos.CompanyRequest) (company models.Company) {
	tx := database.DBConn.Begin()
	company = company.FromDTO(dto)
	company.CreatedBy = creator
	tx.Omit("ID").Create(&company)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Exec("UPDATE com_user SET company_id = ? WHERE email = ?", company.ID, creator)
	tx.Exec("INSERT INTO com_role (company_id, email, role) VALUES (?, ?, 'OWNER')", company.ID, creator)

	tx.Commit()
	return
}

func (dao CompanyDao) Update(id string, dto dtos.CompanyRequest) (company models.Company) {
	tx := database.DBConn.Begin()
	tx.Where("id = ?", id).First(&company)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Model(&company).Updates(models.Company{}.FromDTO(dto))
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
