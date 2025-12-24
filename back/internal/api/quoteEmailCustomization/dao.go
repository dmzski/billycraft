package quoteEmailCustomization

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"
)

type QuoteEmailCustomizationDao struct {
}

func (dao QuoteEmailCustomizationDao) FindAllByTenant(tenant string) (quoteEmailCustomizations []models.QuoteEmailCustomization) {
	if err := database.DBConn.Find(&quoteEmailCustomizations, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteEmailCustomizationDao) FindFirstByTenant(tenant string) (quoteEmailCustomization models.QuoteEmailCustomization) {
	if err := database.DBConn.Where("company_id = ?", tenant).First(&quoteEmailCustomization).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteEmailCustomizationDao) FindOneByIdAndTenant(id string, tenant string) (quoteEmailCustomization models.QuoteEmailCustomization) {
	if err := database.DBConn.Find(&quoteEmailCustomization, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteEmailCustomizationDao) Update(id string, tenant string, changes requests.QuoteEmailCustomizationRequest) (quoteEmailCustomization models.QuoteEmailCustomization) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? and id = ?", tenant, id).First(&quoteEmailCustomization)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Model(&quoteEmailCustomization).Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao QuoteEmailCustomizationDao) Create(creator models.User, newQuoteEmailCustomization requests.QuoteEmailCustomizationRequest) (quoteEmailCustomization models.QuoteEmailCustomization) {
	quoteEmailCustomization = requests.MarshalQuoteEmailCustomizationRequest(newQuoteEmailCustomization)
	quoteEmailCustomization.CompanyID = *creator.CompanyID

	if err := database.DBConn.Omit("Company").Create(&quoteEmailCustomization).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao QuoteEmailCustomizationDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and company_id = (SELECT u.company_id from compta.com_user u where u.email = ?)", id, creator).Delete(&models.QuoteEmailCustomization{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &QuoteEmailCustomizationDao{}
