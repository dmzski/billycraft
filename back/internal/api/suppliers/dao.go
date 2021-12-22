package suppliers

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"log"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant int) (suppliers []models.Supplier) {
	if err := database.DBConn.Where("company_id = ?", tenant).Order("name asc").Find(&suppliers).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant int) (supplier models.Supplier) {
	if err := database.DBConn.Where("company_id = ? AND id = ?", tenant, id).First(&supplier).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant int, changes dtos.SupplierRequest) (supplier models.Supplier) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id = ?", tenant, id).First(&supplier)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx = tx.Updates(models.Supplier{}.FromDTO(changes))
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao Repository) Create(creator models.User, newSupplier dtos.SupplierRequest) (supplier models.Supplier) {
	supplier = supplier.FromDTO(newSupplier)
	supplier.CompanyID = *creator.CompanyID
	supplier.CreatedBy = creator.Email
	if err := database.DBConn.Create(&supplier).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao Repository) Delete(id string, tenant int) {
	if err := database.DBConn.Where("id = ? and company_id = ?", id, tenant).Delete(&models.Supplier{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &Repository{}
