package bills

import (
	"back/database"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
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

func (dao BillDao) FindAllByTenantByStatusIn(tenant string, statuses []enums.BillStatus) (bills []models.Bill) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_bill_line.line asc")
	}).Where("company_id = ? AND status IN ?", tenant, statuses).Order("created_at desc").Find(&bills).Error; err != nil {
		panic(err)
	}
	return
}
func (dao BillDao) FindAllByTenantByStatusNotIn(tenant string, statuses []enums.BillStatus) (bills []models.Bill) {
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

func (dao BillDao) Update(id string, tenant string, changes requests.BillRequest) (bill models.Bill) {
	now := time.Now()
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&bill)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	if changes.Status != nil && *changes.Status != enums.BillStatusDraft {
		if *changes.Status == enums.BillStatusSent && bill.Status.CanBeSent() {
			tx.Model(&bill).Updates(map[string]interface{}{
				"sent_at": &now,
				"status":  enums.BillStatusSent,
			})
		} else if *changes.Status == enums.BillStatusPaid && bill.Status.CanBePaid() {
			tx.Model(&bill).Updates(map[string]interface{}{
				"paid_at": &now,
				"status":  enums.BillStatusPaid,
			})
		} else if *changes.Status == enums.BillStatusArchived && bill.Status.CanBeArchived() {
			tx.Model(&bill).Update("status", enums.BillStatusArchived)
		} else if *changes.Status == enums.BillStatusRefused && bill.Status.CanBeRefused() {
			tx.Model(&bill).Update("status", enums.BillStatusRefused)
		} else {
			panic("Invalid status update")
		}
	}

  if !bill.Status.IsEditable() {
    return bill
  }

	tx.Model(&bill).Updates(&models.Bill{
		CustomerID: changes.CustomerID,
		Title:      changes.Title,
		Tva:        changes.Tva,
	})

	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}

	// Delete bill lines and add the new ones (Set)
	if changes.Lines != nil {
		var lines []models.BillLine
		for _, x := range changes.Lines {
			newLine := models.BillLine{
				BillID:      bill.ID,
				Description: x.Description,
				Line:        x.Line,
				Quantity:    x.Quantity,
				Price:       x.Price,
				ProductID:   x.ProductID,
				Name:        x.Name,
				Type:        x.Type,
			}
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
		newLine := models.BillLine{
			BillID:      bill.ID,
			Description: x.Description,
			Line:        x.Line,
			Quantity:    x.Quantity,
			Price:       x.Price,
			ProductID:   x.ProductID,
			Name:        x.Name,
			Type:        x.Type,
		}
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

func (dao BillDao) Create(creator models.User, newBill requests.BillRequest) (bill models.Bill) {
	tx := database.DBConn.Begin()
	bill = models.Bill{
		Tva:        newBill.Tva,
		Title:      newBill.Title,
		Status:     enums.BillStatusDraft,
		CompanyID:  *creator.CompanyID,
		CustomerID: newBill.CustomerID,
		CreatedBy:  creator.Email,
	}
	tx.Model(&bill).Omit(clause.Associations).Create(&bill)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}
	var lines []models.BillLine
	for _, x := range newBill.Lines {
		newLine := models.BillLine{
			BillID:      bill.ID,
			Description: x.Description,
			Line:        x.Line,
			Quantity:    x.Quantity,
			Price:       x.Price,
			ProductID:   x.ProductID,
			Name:        x.Name,
			Type:        x.Type,
		}
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
