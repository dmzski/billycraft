package models

import (
	"back/internal/lib/enums"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type Quote struct {
	ID         string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name       string `gorm:"<-:create"`
	Title      string
	Tva        *float32
	CreatedAt  time.Time
	UpdatedAt  *time.Time `gorm:"autoUpdateTime"`
	SentAt     *time.Time
	Status     enums.QuoteStatus
	CreatedBy  string `gorm:"<-:create"`
	CompanyID  string `gorm:"<-:create"`
	CustomerID *string
	FileName   *string
	Company    Company
	Customer   *Customer
	Lines      []QuoteLine
}

func (Quote) TableName() string {
	return "com_quote"
}

func (q *Quote) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Omit("Company", "Customer")
	q.CreatedAt = time.Now()
	q.UpdatedAt = nil
	q.SentAt = nil
	q.FileName = nil
	q.Status = "DRAFT"
	var lastId int
	idTx := tx.Raw("SELECT COUNT(*) AS num FROM com_quote WHERE company_id = ?", q.CompanyID).Scan(&lastId)
	if idTx.Error != nil {
		log.Fatalln("Cannot select last id : ", idTx.Error.Error())
		err = idTx.Error
		return
	}
	q.Name = fmt.Sprintf("%s_D%d", time.Now().Format("020106"), lastId+1)
	return
}

func (q *Quote) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.Omit("Company", "Customer")

	return
}
