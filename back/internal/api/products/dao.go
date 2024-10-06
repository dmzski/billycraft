package products

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant string) (products []models.Product) {
	if err := database.DBConn.Find(&products, "company_id = ? ORDER BY name asc", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant string) (product models.Product) {
	if err := database.DBConn.Find(&product, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant string, changes dtos.Product) (product models.Product) {
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

func (dao Repository) Create(creator models.User, newProduct dtos.Product) (product models.Product) {
	product = product.FromDTO(newProduct)
	product.CompanyID = *creator.CompanyID
	product.CreatedBy = creator.Email
	if err := database.DBConn.Create(&product).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao Repository) Delete(id string, tenant string) {
	if err := database.DBConn.Where("id = ? and company_id = ?", id, tenant).Delete(&models.Product{}).Error; err != nil {
		panic(err)
	}
}

func (dao Repository) UpdateStocks(tenant string, changes requests.UpdateStockRequest) (err error) {
	tx := database.DBConn.Begin()
	for _, x := range changes.InMovements {
		tx.Exec("UPDATE com_product SET stock = stock + ? WHERE company_id = ? AND id = ?", x.Quantity, tenant, x.ProductID)
		if tx.Error != nil {
			err = tx.Error
			tx.Rollback()
			return err
		}
	}
	for _, x := range changes.OutMovements {
		tx.Exec("UPDATE com_product SET stock = stock - ? WHERE company_id = ? AND id = ?", x.Quantity, tenant, x.ProductID)
		if tx.Error != nil {
			err = tx.Error
			tx.Rollback()
			return err
		}
	}

	tx.Commit()
	return nil
}

var DAO = &Repository{}
