package customers

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"
	"strings"
)

type CustomerDao struct {
}

func (dao CustomerDao) FindAllByTenant(tenant string) (customers []models.Customer) {
	if err := database.DBConn.Order("name ASC").Where("deleted_at is NULL").Find(&customers, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao CustomerDao) FindAllByTenantAndNameContains(tenant string, q string) (customers []models.Customer) {
	if err := database.DBConn.Order("name ASC").Where("company_id = ? AND TRANSLATE(LOWER(name), ' ', '') LIKE ?", tenant, "%"+strings.ReplaceAll(strings.ToLower(q)+"%", " ", "")).Find(&customers).Error; err != nil {
		panic(err)
	}
	return
}

func (dao CustomerDao) FindOneByIdAndTenant(id string, tenant string) (customer models.Customer) {
	if err := database.DBConn.Unscoped().First(&customer, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao CustomerDao) Update(id string, tenant string, changes requests.CustomerRequest) (customer models.Customer) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&customer)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx.Model(&customer).Updates(changes)
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao CustomerDao) Create(creator models.User, newCustomer requests.CustomerRequest) (customer models.Customer) {
	customer = models.Customer{
		Contact:     newCustomer.Contact,
		City:        newCustomer.City,
		Address:     newCustomer.Address,
		Email:       newCustomer.Email,
		PostalCode:  newCustomer.PostalCode,
		PhoneNumber: newCustomer.PhoneNumber,
		CompanyID:   *creator.CompanyID,
		Name:        newCustomer.Name,
	}
	// customer.CreatedBy = creator.Email
	if err := database.DBConn.Create(&customer).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao CustomerDao) Delete(id string, tenant string) {
	if err := database.DBConn.Where("id = ? and company_id = ?", id, tenant).Delete(&models.Customer{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &CustomerDao{}
