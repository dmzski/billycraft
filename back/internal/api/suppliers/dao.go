package suppliers

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant string) (suppliers []models.Supplier) {
	if err := database.DBConn.Where("company_id = ?", tenant).Order("name asc").Find(&suppliers).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant string) (supplier models.Supplier) {
	if err := database.DBConn.Where("company_id = ? AND id = ?", tenant, id).First(&supplier).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant string, changes requests.SupplierRequest) (supplier models.Supplier) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", tenant, id).First(&supplier)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Model(&supplier).Updates(requests.MarshalSupplierRequest(changes))
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao Repository) Create(creator models.User, newSupplier requests.SupplierRequest) (supplier models.Supplier) {
	supplier = requests.MarshalSupplierRequest(newSupplier)
	supplier.CompanyID = *creator.CompanyID
	supplier.CreatedBy = creator.Email
	if err := database.DBConn.Create(&supplier).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao Repository) Delete(id string, tenant string) {
	if err := database.DBConn.Where("id = ? and company_id = ?", id, tenant).Delete(&models.Supplier{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &Repository{}
