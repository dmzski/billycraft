package bills

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/enums"
	"backv2/models"
	"log"
	"time"
)

type BillDao struct {
}

func (dao BillDao) FindAllByTenant(tenant int) (bills []models.Bill) {
	if err := database.DBConn.Preload("Lines").Find(&bills, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) FindOneByIdAndTenant(id string, tenant int) (bill models.Bill) {
	if err := database.DBConn.Preload("Lines").Find(&bill, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) Update(id string, tenant int, changes dtos.Bill) (bill models.Bill) {
	tx := database.DBConn.Begin()
	tx = database.DBConn.Where("company_id = ? AND id= ?", tenant, id).First(&bill)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	if enums.BillStatus(changes.Status).IsGreaterThanOrEqualSent() && bill.SentAt == nil {
		now := time.Now()
		bill.SentAt = &now
	} else {
		bill.SentAt = nil
	}
	tx = tx.Updates(changes)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}

	// Delete bill lines and add the new ones (Set)
	if changes.Lines != nil {
		var lines []models.BillLine
		for _, x := range changes.Lines {
			x.BillID = bill.ID
			newLine := models.BillLine{}.FromDTO(x)
			lines = append(lines, newLine)
		}

		tx = database.DBConn.Where("bill_id = ?", bill.ID).Delete(models.BillLine{})
		if tx.Error != nil {
			err := tx.Error
			tx.Rollback()
			panic(err)
		}
		err := database.DBConn.Model(&bill).Association("Lines").Append(&lines)
		if err != nil {
			tx.Rollback()
			panic(err)
		}
	}

	tx.Commit()
	tx = database.DBConn.Preload("Lines").Where("company_id = ? AND id= ?", tenant, id).First(&bill)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	return
}

func (dao BillDao) Create(creator models.User, newBill dtos.Bill) (bill models.Bill) {
	bill = bill.FromDTO(newBill)
	bill.CompanyID = *creator.CompanyID
	bill.CreatedBy = creator.Email
	// Delete bill lines and add the new ones (Set)
	if err := database.DBConn.Omit("Company", "Custom").Create(&bill).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao BillDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and email = ?", id, creator).Delete(&models.Bill{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &BillDao{}
