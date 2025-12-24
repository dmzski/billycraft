package models

import (
	"back/internal/lib/enums"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Bill struct {
	ID         string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Name       string `gorm:"<-:create"`
	Title      string
	Tva        *float32
	CreatedAt  time.Time
	UpdatedAt  *time.Time `gorm:"autoUpdateTime"`
	PaidAt     *time.Time
	SentAt     *time.Time
	Status     enums.BillStatus
	CreatedBy  string `gorm:"<-:create"`
	CompanyID  string `gorm:"<-:create"`
	CustomerID *string
	FileName   *string
	Company    Organization
	Customer   *Customer
	Lines      []BillLine
}

func (Bill) TableName() string {
	return "com_bill"
}

func (b *Bill) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Omit(clause.Associations)
	b.CreatedAt = time.Now()
	b.UpdatedAt = nil
	b.SentAt = nil
	b.SentAt = nil
	b.FileName = nil
	b.Status = "DRAFT"
	var lastId int
	idTx := tx.Raw("SELECT COUNT(*) AS num FROM com_bill WHERE company_id = ?", b.CompanyID).Scan(&lastId)
	if idTx.Error != nil {
		log.Fatalln("Cannot select last id : ", idTx.Error.Error())
		err = idTx.Error
		return
	}

	b.Name = fmt.Sprintf("%s_F%d", time.Now().Format("020106"), lastId+1)
	return
}

func (b *Bill) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.Omit("Company", "Customer")

	if b.Status == "" {
		b.Status = "DRAFT"
	}

	return
}
