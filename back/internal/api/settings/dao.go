package settings

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"log"
)

type SettingDao struct {
}

func (dao SettingDao) FindAllByTenant(tenant int) (settings []models.Setting) {
	if err := database.DBConn.Preload("Lines").Find(&settings, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao SettingDao) FindOneByIdAndTenant(id string, tenant int) (setting models.Setting) {
	if err := database.DBConn.Preload("Lines").Find(&setting, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao SettingDao) Update(id string, tenant int, changes dtos.Setting) (setting models.Setting) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&setting)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao SettingDao) Create(creator models.User, newSetting dtos.Setting) (setting models.Setting) {
	setting = setting.FromDTO(newSetting)
	setting.CompanyID = *creator.CompanyID
	if err := database.DBConn.Omit("Company").Create(&setting).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao SettingDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and company_id = (SELECT u.company_id from compta.com_user u WHERE u.email = ?)", id, creator).Delete(&models.Setting{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &SettingDao{}
