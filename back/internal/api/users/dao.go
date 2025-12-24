package users

import (
	"back/database"
	"back/internal/lib/models"
	"gorm.io/gorm/clause"
)

type UserDao struct{}

func (dao UserDao) FindByEmail(email string) (user models.User) {
	database.DBConn.Preload("Roles").First(user, "email = ?", email)
	return
}

func (dao UserDao) FindMe(email string) (user models.User, err error) {
	tx := database.DBConn.Preload(clause.Associations).First(&user, "email = ?", email)
	if tx.Error != nil {
		err = tx.Error
	}
	return
}

func (dao UserDao) FindAllByCompanyId(organizationId string) (users []models.User) {
	tx := database.DBConn.Preload("Roles").Find(&users, "company_id = ?", organizationId).Order("email asc")
	if tx.Error != nil {
		panic(tx.Error)
	}
	return
}

func (dao UserDao) Create(user models.User) models.User {
	if err := database.DBConn.Create(&user).Error; err != nil {
		panic(err)
	}
	return user
}

func (dao UserDao) SaveUser(user models.User) models.User {
	if err := database.DBConn.Select("FirstName", "LastName").Save(&user).Error; err != nil {
		panic(err)
	}
	return user
}

func (dao UserDao) LeaveCompany(email string, organizationId string) error {
	tx := database.DBConn.Begin()
	tx.Exec("DELETE FROM com_role WHERE email = ? AND company_id = ? AND role <> 'OWNER'", email, organizationId)
	if tx.Error != nil {
		tx.Rollback()
		return tx.Error
	}
	tx.Exec("UPDATE com_user SET company_id = ? WHERE email = ?", nil, email)
	if tx.Error != nil {
		tx.Rollback()
		return tx.Error
	}

	tx.Commit()

	return nil
}

var DAO = &UserDao{}
