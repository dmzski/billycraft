package bills

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type BillDao struct {
}

func (dao BillDao) FindAllByTenant(tenant string) (bills []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Order("created_at desc").Find(&bills, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) FindAllByTenantByStatusIs(tenant string, status string) (bill []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND status = ?", tenant, status).Order("created_at desc").Find(&bill).Error; err != nil {
		panic(err)
	}
	return
}
func (dao BillDao) FindAllByTenantByStatusIsNot(tenant string, status string) (bill []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND status <> ?", tenant, status).Order("created_at desc").Find(&bill).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) FindAllByTenantByStatusIn(tenant string, statuses []string) (bills []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND status IN ?", tenant, statuses).Order("created_at desc").Find(&bills).Error; err != nil {
		panic(err)
	}
	return
}
func (dao BillDao) FindAllByTenantByStatusNotIn(tenant string, statuses []string) (bills []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND status NOT IN ?", tenant, statuses).Order("created_at desc").Find(&bills).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) FindAllByTenantByNotPaid(tenant string) (bills []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND status = 'SENT' AND paid_at IS NULL", tenant).Order("created_at desc").Find(&bills).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) FindOneByIdAndTenant(id string, tenant string) (bill models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Find(&bill, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao BillDao) Update(id string, tenant string, changes dtos.Bill) (bill models.Bill) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&bill)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	if changes.Status != nil {
		if *changes.Status == enums.BillStatusDraft {
			tx.Model(&bill).Updates(map[string]interface{}{
				"sent_at": gorm.Expr("NULL"),
				"paid_at": gorm.Expr("NULL"),
			})
		} else {
			if bill.SentAt == nil {
				now := time.Now()
				changes.SentAt = &now
			}
			if *changes.Status == enums.BillStatusSent && bill.PaidAt != nil {
				tx.Model(&bill).Updates(map[string]interface{}{
					"paid_at": gorm.Expr("NULL"),
				})
			} else {
				if *changes.Status == enums.BillStatusArchived && bill.PaidAt == nil {
					now := time.Now()
					changes.PaidAt = &now
				}
			}
		}
	}
	tx.Model(&bill).Updates(changes)

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

		tx.Where("bill_id = ?", bill.ID).Delete(models.BillLine{})
		if tx.Error != nil {
			err := tx.Error
			tx.Rollback()
			panic(err)
		}
		err := tx.Model(&bill).Association("Lines").Append(&lines)
		if err != nil {
			tx.Rollback()
			panic(err)
		}
	}

	tx.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND id= ?", tenant, id).First(&bill)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

func (dao BillDao) Duplicate(id string, tenant string) (bill models.Bill) {
	existingBill := models.Bill{}
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Find(&existingBill, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	tx := database.DBConn.Begin()

	// Reset fields
	bill = existingBill
	bill.ID = ""
	bill.PaidAt = nil
	bill.SentAt = nil
	bill.Status = "DRAFT"
	bill.CompanyID = existingBill.CompanyID
	bill.CreatedBy = existingBill.CreatedBy
	// End reset fields

	tx.Model(&bill).Omit(clause.Associations).Create(&bill)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}
	var lines []models.BillLine
	for _, x := range bill.Lines {
		x.BillID = bill.ID
		newLine := models.BillLine{}.FromDTO(x.ToDTO())
		lines = append(lines, newLine)
	}
	err := tx.Model(&bill).Association("Lines").Append(&lines)
	if err != nil {
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

func (dao BillDao) Create(creator models.User, newBill dtos.Bill) (bill models.Bill) {
	tx := database.DBConn.Begin()
	bill = bill.FromDTO(newBill)
	bill.CompanyID = *creator.CompanyID
	bill.CreatedBy = creator.Email
	tx.Model(&bill).Omit(clause.Associations).Create(&bill)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}
	var lines []models.BillLine
	for _, x := range newBill.Lines {
		x.BillID = bill.ID
		newLine := models.BillLine{}.FromDTO(x)
		lines = append(lines, newLine)
	}
	err := tx.Model(&bill).Association("Lines").Append(&lines)
	if err != nil {
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

var DAO = &BillDao{}
