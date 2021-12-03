package products

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/models"
	"log"
)

type ProductDao struct {
}

func (dao ProductDao) FindAllByTenant(tenant int) (products []models.Product) {
	if err := database.DBConn.Find(&products, "company_id = ? ORDER BY name asc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao ProductDao) FindOneByIdAndTenant(id string, tenant int) (product models.Product) {
	if err := database.DBConn.Find(&product, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao ProductDao) Update(id string, tenant int, changes dtos.Product) (product models.Product) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id = ?", tenant, id).First(&product)
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

func (dao ProductDao) Create(creator models.User, newProduct dtos.Product) (product models.Product) {
	product = product.FromDTO(newProduct)
	product.CompanyID = *creator.CompanyID
	product.CreatedBy = creator.Email
	if err := database.DBConn.Create(&product).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao ProductDao) Delete(id string, tenant int) {
	if err := database.DBConn.Where("id = ? and company_id = ?", id, tenant).Delete(&models.Product{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &ProductDao{}
