package quotes

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"log"
	"time"

	"gorm.io/gorm"
)

type QuoteDao struct {
}

func (dao QuoteDao) FindAllByTenant(tenant int) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Order("created_at desc").Find(&quotes, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindAllByTenantByStatusIs(tenant int, status string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status = ?", tenant, status).Order("created_at desc").Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}
func (dao QuoteDao) FindAllByTenantByStatusIn(tenant int, statuses []string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status IN ?", tenant, statuses).Find(&quotes).Order("created_at desc").Error; err != nil {
		panic(err)
	}
	return
}
func (dao QuoteDao) FindAllByTenantByStatusNotIn(tenant int, statuses []string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status NOT IN ?", tenant, statuses).Order("created_at desc").Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindAllByTenantByStatusIsNot(tenant int, status string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status <> ?", tenant, status).Order("created_at desc").Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindOneByIdAndTenant(id string, tenant int) (quote models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Find(&quote, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) Update(id string, tenant int, changes dtos.Quote) (quote models.Quote) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&quote)
	if tx.Error != nil {
		panic(tx.Error)
	}
	if enums.QuoteStatus(changes.Status).IsGreaterThanOrEqualSent() {
		if quote.SentAt == nil {
			now := time.Now()
			changes.SentAt = &now
		}
	} else {
		if quote.SentAt != nil {
			tx.Model(&quote).Updates(map[string]interface{}{
				"sent_at": gorm.Expr("NULL"),
			})
		}
	}
	tx.Model(&quote).Updates(changes)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}

	// Delete quote lines and add the new ones (Set)
	if changes.Lines != nil {
		var lines []models.QuoteLine
		for _, x := range changes.Lines {
			x.QuoteID = quote.ID
			newLine := models.QuoteLine{}.FromDTO(x)
			lines = append(lines, newLine)
		}
		tx.Where("quote_id = ?", quote.ID).Delete(models.QuoteLine{})
		if tx.Error != nil {
			tx.Rollback()
			panic(tx.Error)
		}
		err := tx.Model(&quote).Association("Lines").Append(&lines)
		if err != nil {
			tx.Rollback()
			panic(err)
		}
	}

	tx.Commit()
	return
}

func (dao QuoteDao) Create(creator models.User, newQuote dtos.Quote) (quote models.Quote) {
	quote = quote.FromDTO(newQuote)
	quote.CompanyID = *creator.CompanyID
	quote.CreatedBy = creator.Email
	// Delete quote lines and add the new ones (Set)
	if err := database.DBConn.Omit("Company", "Custom").Create(&quote).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao QuoteDao) CreateBill(creator models.User, id string) (bill models.Bill) {
	tx := database.DBConn.Begin()
	quote := models.Quote{}
	if err := tx.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Find(&quote, "company_id = ? AND id = ?", creator.CompanyID, id).Error; err != nil {
		panic(err)
	}
	bill = bill.FromQuote(quote)
	bill.CompanyID = *creator.CompanyID
	bill.CreatedBy = creator.Email
	bill.Status = "DRAFT"
  quote.Status = "ARCHIVED"

	if err := database.DBConn.Omit("Company", "Custom").Create(&bill).Error; err != nil {
		log.Println("Error : ", err.Error())
		panic(err)
	}
	return
}

func (dao QuoteDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and email = ?", id, creator).Delete(&models.Quote{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &QuoteDao{}
