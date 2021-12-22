package quoteCustomization

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"log"
)

type QuoteCustomizationDao struct {
}

func (dao QuoteCustomizationDao) FindAllByTenant(tenant int) (quoteCustomizations []models.QuoteCustomization) {
	if err := database.DBConn.Find(&quoteCustomizations, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteCustomizationDao) FindFirstByTenant(tenant int) (quoteCustomization models.QuoteCustomization) {
	if err := database.DBConn.Where("company_id = ?", tenant).First(&quoteCustomization).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteCustomizationDao) FindOneByIdAndTenant(id string, tenant int) (quoteCustomization models.QuoteCustomization) {
	if err := database.DBConn.Find(&quoteCustomization, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteCustomizationDao) Update(id string, tenant int, changes dtos.QuoteCustomization) (quoteCustomization models.QuoteCustomization) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id= ?", tenant, id).First(&quoteCustomization)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx = tx.Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao QuoteCustomizationDao) Create(creator models.User, newQuoteCustomization dtos.QuoteCustomization) (quoteCustomization models.QuoteCustomization) {
	quoteCustomization = quoteCustomization.FromDTO(newQuoteCustomization)
	quoteCustomization.CompanyID = *creator.CompanyID

	if err := database.DBConn.Omit("Company").Create(&quoteCustomization).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao QuoteCustomizationDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and company_id = (SELECT u.company_id from compta.com_user u where u.email = ?)", id, creator).Delete(&models.QuoteCustomization{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &QuoteCustomizationDao{}
