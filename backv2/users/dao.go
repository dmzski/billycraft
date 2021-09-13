package users

import (
	"backv2/database"
	"backv2/models"
	"log"

	"gorm.io/gorm/clause"
)

type UserDao struct{}

func (dao UserDao) FindByEmail(email string) (user models.User) {
	database.DBConn.First(user, "email = ?", email)
	return
}

func (dao UserDao) FindMe(email string) (user models.User) {
	tx := database.DBConn.Debug().Preload(clause.Associations).First(&user, "com_user.email = ?", email)
	if tx.Error != nil {
		log.Println(tx.Error.Error())
	}
	return
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

func (dao UserDao) JoinCompany(email string, cid int) {
	if err := database.DBConn.Exec("UPDATE compta.com_user SET company_id = ? WHERE email = ?", cid, email).Error; err != nil {
		panic(err)
	}
}

var DAO = &UserDao{}
