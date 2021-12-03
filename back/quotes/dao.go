package quotes

import (
	"backv2/database"
	"backv2/dtos"
	"backv2/enums"
	"backv2/models"
	"log"
	"time"

	"gorm.io/gorm"
)

type QuoteDao struct {
}

func (dao QuoteDao) FindAllByTenant(tenant int) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines").Find(&quotes, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindAllByTenantByStatusIs(tenant int, status string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines").Where("company_id = ? AND status = ?", tenant, status).Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}
func (dao QuoteDao) FindAllByTenantByStatusIsNot(tenant int, status string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines").Where("company_id = ? AND status <> ?", tenant, status).Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindOneByIdAndTenant(id string, tenant int) (quote models.Quote) {
	if err := database.DBConn.Preload("Lines").Find(&quote, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) Update(id string, tenant int, changes dtos.Quote) (quote models.Quote) {
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&quote)
	if tx.Error != nil {
		tx.Rollback()
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

func (dao QuoteDao) Delete(id string, creator string) {
	if err := database.DBConn.Where("id = ? and email = ?", id, creator).Delete(&models.Quote{}).Error; err != nil {
		panic(err)
	}
}

var DAO = &QuoteDao{}
