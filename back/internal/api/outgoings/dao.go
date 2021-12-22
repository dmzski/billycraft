package outgoings

import (
	"backv2/database"
	"backv2/internal/lib/models"
	"log"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant int) (outgoings []Outgoing) {
	if err := database.DBConn.Where("company_id = ?", tenant).Order("name asc").Find(&outgoings).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant int) (outgoing Outgoing) {
	if err := database.DBConn.Where("company_id = ? AND id = ?", tenant, id).First(&outgoing).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant int, changes OutgoingRequest) (outgoing Outgoing) {
	tx := database.DBConn.Begin()
	tx = tx.Where("company_id = ? AND id = ?", tenant, id).First(&outgoing)
	if tx.Error != nil {
		panic(tx.Error)
	}
	tx = tx.Updates(Outgoing{}.FromDTO(changes))
	if tx.Error != nil {
		panic(tx.Error)
	}

	tx.Commit()
	return
}

func (dao Repository) Create(creator models.User, request OutgoingRequest) (outgoing Outgoing) {
	outgoing = outgoing.FromDTO(request)
	outgoing.CompanyID = *creator.CompanyID
	outgoing.CreatedBy = creator.Email
	if err := database.DBConn.Create(&outgoing).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

var DAO = &Repository{}
