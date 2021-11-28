package customers

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/models"
	"log"
	"strings"
)

type CustomerDao struct {
}

func (dao CustomerDao) FindAllByTenant(tenant int) (customers []models.Customer) {
	if err := database.DBConn.Find(&customers, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao CustomerDao) FindAllByTenantAndNameContains(tenant int, q string) (customers []models.Customer) {
	if err := database.DBConn.Where("company_id = ? AND TRANSLATE(LOWER(name), ' ', '') LIKE ?", tenant, "%"+strings.ReplaceAll(strings.ToLower(q)+"%", " ", "")).Find(&customers).Error; err != nil {
		panic(err)
	}
	return
}

func (dao CustomerDao) FindOneByIdAndTenant(id int, tenant int) (customer models.Customer) {
	if err := database.DBConn.Find(&customer, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao CustomerDao) Update(id int, tenant int, changes dtos.Customer) (customer models.Customer) {
	tx := database.DBConn.Begin()
	tx = database.DBConn.Where("company_id = ? AND id= ?", tenant, id).First(&customer)
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

func (dao CustomerDao) Create(creator models.User, newCustomer dtos.Customer) (customer models.Customer) {
	customer = customer.FromDTO(newCustomer)
	customer.CompanyID = *creator.CompanyID
	// customer.CreatedBy = creator.Email
	if err := database.DBConn.Create(&customer).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao CustomerDao) Delete(id int, creator string) {
	if err := database.DBConn.Where("id = ? and email = ?", id, creator).Delete(&models.Customer{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &CustomerDao{}
