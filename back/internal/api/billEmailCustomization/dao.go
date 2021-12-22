package billEmailCustomization

import (
	"backv2/database"
	"backv2/internal/lib/dtos"
	"backv2/internal/lib/models"
	"log"
)

type BillEmailCustomizationDao struct {
}

func (dao BillEmailCustomizationDao) FindAllByTenant(tenant int) (billEmailCustomizations []models.BillEmailCustomization) {
	if err := database.DBConn.Find(&billEmailCustomizations, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillEmailCustomizationDao) FindFirstByTenant(tenant int) (billEmailCustomization models.BillEmailCustomization) {
	if err := database.DBConn.Where("company_id = ?", tenant).First(&billEmailCustomization).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillEmailCustomizationDao) FindOneByIdAndTenant(id string, tenant int) (billEmailCustomization models.BillEmailCustomization) {
	if err := database.DBConn.Find(&billEmailCustomization, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillEmailCustomizationDao) Update(id string, tenant int, changes dtos.BillEmailCustomization) (billEmailCustomization models.BillEmailCustomization) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id= ?", tenant, id).First(&billEmailCustomization)
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

func (dao BillEmailCustomizationDao) Create(creator models.User, newBillEmailCustomization dtos.BillEmailCustomization) (billEmailCustomization models.BillEmailCustomization) {
	billEmailCustomization = billEmailCustomization.FromDTO(newBillEmailCustomization)
	billEmailCustomization.CompanyID = *creator.CompanyID

	if err := database.DBConn.Omit("Company").Create(&billEmailCustomization).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao BillEmailCustomizationDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and company_id = (SELECT u.company_id from compta.com_user u where u.email = ?)", id, creator).Delete(&models.BillEmailCustomization{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &BillEmailCustomizationDao{}
