package company

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
)

type OrganizationDao struct {
}

func (dao OrganizationDao) FindAll() (organizations []models.Organization) {
	database.DBConn.Find(&organizations)
	return
}

func (dao OrganizationDao) FindAllForMonthCron() (organizations []models.Organization) {
	database.DBConn.Where("auto_month_report = true").Find(&organizations)
	return
}
func (dao OrganizationDao) FindAllForYearCron() (organizations []models.Organization) {
	database.DBConn.Where("auto_year_report = true").Find(&organizations)
	return
}

func (dao OrganizationDao) FindOneById(id string) (company models.Organization) {
	database.DBConn.Where("id = ?", id).First(&company)
	return
}

func (dao OrganizationDao) Create(creator string, dto requests.OrganizationRequest) (organization models.Organization) {
	tx := database.DBConn.Begin()
	organization = requests.MarshalOrganizationRequest(dto)
	organization.CreatedBy = creator
	tx.Omit("ID").Create(&organization)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Exec("UPDATE com_user SET company_id = ? WHERE email = ?", organization.ID, creator)
	tx.Exec("INSERT INTO com_role (company_id, email, role) VALUES (?, ?, 'OWNER')", organization.ID, creator)

	tx.Commit()
	return
}

func (dao OrganizationDao) Update(id string, dto requests.OrganizationRequest) (organization models.Organization) {
	tx := database.DBConn.Begin()
	tx.Where("id = ?", id).First(&organization)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Model(&organization).Updates(dto)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

var (
	DAO = &OrganizationDao{}
)
