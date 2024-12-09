package quotes

import (
	"back/database"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type QuoteDao struct {
}

func (dao QuoteDao) FindAllByTenant(tenant string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Order("created_at desc").Find(&quotes, "company_id = ?", tenant).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindAllByTenantByStatusIs(tenant string, status string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status = ?", tenant, status).Order("created_at desc").Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}
func (dao QuoteDao) FindAllByTenantByStatusIn(tenant string, statuses []enums.QuoteStatus) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status IN ?", tenant, statuses).Find(&quotes).Order("created_at desc").Error; err != nil {
		panic(err)
	}
	return
}
func (dao QuoteDao) FindAllByTenantByStatusNotIn(tenant string, statuses []enums.QuoteStatus) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status NOT IN ?", tenant, statuses).Order("created_at desc").Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindAllByTenantByStatusIsNot(tenant string, status string) (quotes []models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Where("company_id = ? AND status <> ?", tenant, status).Order("created_at desc").Find(&quotes).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) FindOneByIdAndTenant(id string, tenant string) (quote models.Quote) {
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Find(&quote, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	return
}

func (dao QuoteDao) Update(id string, tenant string, changes requests.UpdateQuoteRequest) (quote models.Quote) {
	now := time.Now()
	var lines []models.QuoteLine
	tx := database.DBConn.Begin()
	tx.Where("company_id = ? AND id= ?", tenant, id).First(&quote)
	if tx.Error != nil {
		panic(tx.Error)
	}
	if changes.Status != nil && *changes.Status != enums.QuoteStatusDraft {
		if *changes.Status == enums.QuoteStatusSent && quote.Status.CanBeSent() {
			tx.Model(&quote).Updates(map[string]interface{}{
				"sent_at": &now,
				"status":  enums.QuoteStatusSent,
			})
		} else if *changes.Status == enums.QuoteStatusAccepted && quote.Status.CanBeAccepted() {
			tx.Model(&quote).Update("status", enums.QuoteStatusAccepted)
		} else if *changes.Status == enums.QuoteStatusRefused && quote.Status.CanBeRefused() {
			tx.Model(&quote).Update("status", enums.QuoteStatusRefused)
		} else if *changes.Status == enums.QuoteStatusArchived && quote.Status.CanBeArchived() {
			tx.Model(&quote).Update("status", enums.QuoteStatusArchived)
		} else {
			panic("Invalid status change")
		}
	}
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
  
  if !quote.Status.IsEditable() {
    tx.Commit()
    return quote
  }

	if changes.Lines != nil {
		for _, x := range changes.Lines {
			newLine := requests.MarshalQuoteLineRequest(x)
			newLine.QuoteID = quote.ID
			lines = append(lines, newLine)
		}
	}
	tx.Model(&quote).Updates(&models.Quote{
		Tva:        changes.Tva,
		Title:      changes.Title,
		CustomerID: changes.CustomerID,
	})
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}

	// Delete quote lines and add the new ones (Set)
	if changes.Lines != nil {
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

func (dao QuoteDao) Duplicate(id string, tenant string) (quote models.Quote) {
	existingQuote := models.Quote{}
	if err := database.DBConn.Preload("Lines", func(db *gorm.DB) *gorm.DB {
		return db.Order("com_quote_line.line asc")
	}).Find(&existingQuote, "company_id = ? AND id = ?", tenant, id).Error; err != nil {
		panic(err)
	}
	tx := database.DBConn.Begin()

	// Reset fields
	quote = existingQuote
	quote.ID = ""
	quote.SentAt = nil
	quote.Status = "DRAFT"
	quote.CompanyID = existingQuote.CompanyID
	quote.CreatedBy = existingQuote.CreatedBy
	// End reset fields

	tx.Model(&quote).Omit(clause.Associations).Create(&quote)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}
	var lines []models.QuoteLine
	for _, x := range quote.Lines {
		x.QuoteID = quote.ID
		lines = append(lines, x)
	}
	err := tx.Model(&quote).Association("Lines").Append(&lines)
	if err != nil {
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
	return
}

func (dao QuoteDao) Create(creator models.User, newQuote requests.CreateQuoteRequest) (quote models.Quote) {
	tx := database.DBConn.Begin()
	quote = requests.MarshalCreateQuoteRequest(newQuote)
	quote.CompanyID = *creator.CompanyID
	quote.CreatedBy = creator.Email
	tx.Model(&quote).Omit(clause.Associations).Create(&quote)
	if tx.Error != nil {
		tx.Rollback()
		panic(tx.Error)
	}
	var lines []models.QuoteLine
	for _, x := range newQuote.Lines {
		newLine := requests.MarshalQuoteLineRequest(x)
		newLine.QuoteID = quote.ID
		lines = append(lines, newLine)
	}
	err := tx.Model(&quote).Association("Lines").Append(&lines)
	if err != nil {
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
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
	lines := []models.BillLine{}
	for _, x := range quote.Lines {
		lines = append(lines, models.BillLine{
			Line:        x.Line,
			Quantity:    x.Quantity,
			Price:       x.Price,
			Name:        x.Name,
			Description: x.Description,
			Type:        x.Type,
			ProductID:   x.ProductID,
		})
	}
	bill = models.Bill{
		Tva:        quote.Tva,
		Title:      quote.Title,
		Status:     enums.BillStatusDraft,
		CompanyID:  *creator.CompanyID,
		CreatedBy:  creator.Email,
		CustomerID: quote.CustomerID,
		Lines:      lines,
	}

	if err := tx.Omit("Company", "Custom").Create(&bill).Error; err != nil {
		tx.Rollback()
		panic(err)
	}
	if err := tx.Model(&quote).Update("status", "ARCHIVED").Error; err != nil {
		tx.Rollback()
		panic(err)
	}

	tx.Commit()

	return
}

var DAO = &QuoteDao{}
