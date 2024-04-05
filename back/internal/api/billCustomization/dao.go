package billCustomization

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"log"
)

type BillCustomizationDao struct {
}

func (dao BillCustomizationDao) FindAllByTenant(tenant int) (billCustomizations []models.BillCustomization) {
	if err := database.DBConn.Find(&billCustomizations, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillCustomizationDao) FindFirstByTenant(tenant int) (billCustomization models.BillCustomization) {
	if err := database.DBConn.Where("company_id = ?", tenant).First(&billCustomization).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillCustomizationDao) FindFirstOrInitByTenant(tenant int) (billCustomization models.BillCustomization) {
	if err := database.DBConn.Where("company_id = ?", tenant).FirstOrInit(&billCustomization).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillCustomizationDao) FindOneByIdAndTenant(id string, tenant int) (billCustomization models.BillCustomization) {
	if err := database.DBConn.Find(&billCustomization, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillCustomizationDao) Update(id string, tenant int, changes dtos.BillCustomization) (billCustomization models.BillCustomization) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&billCustomization)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Model(&billCustomization).Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao BillCustomizationDao) Create(companyId int, newBillCustomization dtos.BillCustomization) (billCustomization models.BillCustomization) {
	billCustomization = billCustomization.FromDTO(newBillCustomization)
	billCustomization.CompanyID = companyId

	if err := database.DBConn.Omit("Company").Create(&billCustomization).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao BillCustomizationDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and company_id = (SELECT u.company_id from compta.com_user u where u.email = ?)", id, creator).Delete(&models.BillCustomization{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &BillCustomizationDao{}
