package users

import (
	"back/database"
	"back/internal/lib/models"
	"log"

	"gorm.io/gorm/clause"
)

type UserDao struct{}

func (dao UserDao) FindByEmail(email string) (user models.User) {
	database.DBConn.First(user, "email = ?", email)
	return
}

func (dao UserDao) FindMe(email string) (user models.User) {
	tx := database.DBConn.Preload(clause.Associations).First(&user, "com_user.email = ?", email)
	if tx.Error != nil {
		log.Println(tx.Error.Error())
	}
	return
}

func (dao UserDao) FindAllByCompanyId(tenant string) (users []models.User) {
	tx := database.DBConn.Find(&users, "company_id = ?", tenant)
	if tx.Error != nil {
		log.Println(tx.Error.Error())
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

func (dao UserDao) LeaveCompany(user models.User) models.User {
	if err := database.DBConn.Model(&user).Association("Company").Clear(); err != nil {
		panic(err)
	}
	return user
}

func (dao UserDao) JoinCompany(email string, cid string) {
	if err := database.DBConn.Exec("UPDATE com_user SET company_id = ? WHERE email = ?", cid, email).Error; err != nil {
		panic(err)
	}
}

var DAO = &UserDao{}
