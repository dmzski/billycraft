package outgoings

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"
	"time"
)

type Repository struct {
}

func (dao Repository) FindAllByTenant(tenant string) (outgoings []models.Outgoing) {
	if err := database.DBConn.Preload("Lines").Where("company_id = ?", tenant).Order("name asc").Find(&outgoings).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByIdAndTenant(id string, tenant string) (outgoing models.Outgoing) {
	if err := database.DBConn.Preload("Lines").Where("company_id = ? AND id = ?", tenant, id).First(&outgoing).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindOneByTenantAndDate(tenant string, date time.Time) (outgoing models.Outgoing) {
	if err := database.DBConn.Preload("Lines").Where("company_id = ? AND start_date < ? AND end_date > ?", tenant, date, date).First(&outgoing).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) FindAllBetweenDates(tenant string, start time.Time, end time.Time) (outgoings []models.Outgoing) {
	if err := database.DBConn.Preload("Lines").Where("company_id = ? AND start_date >= ? AND end_date <= ?", tenant, start, end).Find(&outgoings).Error; err != nil {
		panic(err)
	}
	return
}

func (dao Repository) Update(id string, tenant string, changes requests.OutgoingRequest) (outgoing models.Outgoing) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id = ?", tenant, id).First(&outgoing)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}
	tx.Model(&outgoing).Updates(changes)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}

	// Delete bill lines and add the new ones (Set)
	if changes.Lines != nil {
		var lines []models.OutgoingLine
		for _, x := range changes.Lines {
			newLine := models.OutgoingLine{
				VAT:                   x.VAT,
				BillID:                x.BillID,
				SupplierID:            x.SupplierID,
				Line:                  x.Line,
				TotalHT:               x.TotalHT,
				SupplierBillReference: x.SupplierBillReference,
				OutgoingID:            id,
			}

			lines = append(lines, newLine)
		}

		tx.Where("outgoing_id = ?", outgoing.ID).Delete(models.OutgoingLine{})
		if tx.Error != nil {
			err := tx.Error
			tx.Rollback()
			panic(err)
		}
		err := tx.Model(&outgoing).Association("Lines").Append(&lines)
		if err != nil {
			tx.Rollback()
			panic(err)
		}
	}

	tx.Commit()
	outgoing = dao.FindOneByIdAndTenant(id, tenant)
	return
}

func (dao Repository) Create(creator models.User, request requests.OutgoingRequest) (outgoing models.Outgoing) {
	outgoing = requests.MarshalOutgoingRequest(request)
	outgoing.CompanyID = *creator.CompanyID
	outgoing.CreatedBy = creator.Email
	if err := database.DBConn.Create(&outgoing).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

var DAO = &Repository{}
