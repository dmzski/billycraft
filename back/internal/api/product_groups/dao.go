package product_groups

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant string) (products []models.ProductGroup) {
	if err := database.DBConn.Find(&products, "company_id = ? ORDER BY name asc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant string) (product models.ProductGroup) {
	if err := database.DBConn.Find(&product, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant string, changes requests.ProductGroupUpdateRequest) (product models.ProductGroup) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", tenant, id).First(&product)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Model(&product).Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao Repository) Create(creator models.User, newGroup requests.ProductGroupCreateRequest) (product models.ProductGroup) {
	product.Name = newGroup.Name
	product.CompanyID = *creator.CompanyID
	product.CreatedBy = creator.Email

	if err := database.DBConn.Create(&product).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao Repository) Delete(id string, tenant string) {
	if err := database.DBConn.Where("id = ? and company_id = ?", id, tenant).Delete(&models.ProductGroup{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &Repository{}
