package products

import (
	"back/database"
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

func (dao Repository) Update(id string, tenant string, dto requests.UpdateProductRequest) (product models.Product) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", tenant, id).First(&product)
	if tx.Error != nil {
		panic(tx.Error)
	}
	changes := map[string]interface{}{}
	if dto.Name != "" {
		changes["Name"] = dto.Name
	}
	if dto.Type != "" {
		changes["Type"] = dto.Type
	}
	if dto.Type == "ARTICLE" {
		changes["Stock"] = dto.Stock
		changes["Code"] = dto.Code
		changes["StockAlert"] = dto.StockAlert
		changes["LowStock"] = dto.LowStock
		changes["Price"] = dto.Price
	}

	changes["Description"] = dto.Description
	changes["GroupID"] = dto.GroupID
	changes["SupplierID"] = dto.SupplierID

	tx.Model(&product).Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao Repository) Create(creator models.User, newProduct requests.CreateProductRequest) (product models.Product) {
	product = requests.MarshalCreateProductRequest(newProduct)
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
