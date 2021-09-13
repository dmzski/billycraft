package models

import (
	"backv2/dtos"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Bill struct {
	ID         string `gorm:"primaryKey"`
	Title      string
	Tva        *int
	CreatedAt  time.Time
	UpdatedAt  *time.Time `gorm:"autoUpdateTime"`
	SentAt     *time.Time
	Status     string
	CreatedBy  string
	CompanyID  int
	CustomerID *int
	FileName   *string
	Company    Company
	Customer   *Customer
	Lines      []BillLine
}

func (Bill) TableName() string {
	return "compta.com_bill"
}

func (b *Bill) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Omit(clause.Associations)
	b.CreatedAt = time.Now()
	b.UpdatedAt = nil
	b.SentAt = nil
	b.FileName = nil
	var lastId int
	idTx := tx.Raw("SELECT COUNT(*) AS num FROM compta.com_bill WHERE company_id = ?", b.CompanyID).Scan(&lastId)
	if idTx.Error != nil {
		log.Fatalln("Cannot select last id : ", idTx.Error.Error())
		err = idTx.Error
		return
	}

	b.ID = fmt.Sprintf("%d_%s_F%d", b.CompanyID, time.Now().Format("020106"), lastId+1)
	return
}

func (b *Bill) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.Omit("Company", "Customer")
	return
}

func (Bill) FromDTO(b dtos.Bill) Bill {
	lines := []BillLine{}
	for _, x := range b.Lines {
		x.BillID = ""
		lines = append(lines, BillLine{}.FromDTO(x))
	}
	return Bill{
		ID:         b.ID,
		Title:      b.Title,
		Tva:        b.Tva,
		CreatedAt:  b.CreatedAt,
		UpdatedAt:  b.UpdatedAt,
		SentAt:     b.SentAt,
		Status:     b.Status,
		CreatedBy:  b.CreatedBy,
		CompanyID:  b.CompanyID,
		CustomerID: b.CustomerID,
		FileName:   b.FileName,
		Lines:      lines,
	}
}

func (bill Bill) ToDTO() dtos.Bill {
	lines := []dtos.BillLine{}
	for _, x := range bill.Lines {
		lines = append(lines, x.ToDTO())
	}
	return dtos.Bill{
		ID:         bill.ID,
		Title:      bill.Title,
		Tva:        bill.Tva,
		CreatedAt:  bill.CreatedAt,
		UpdatedAt:  bill.UpdatedAt,
		SentAt:     bill.SentAt,
		Status:     bill.Status,
		CreatedBy:  bill.CreatedBy,
		CompanyID:  bill.CompanyID,
		CustomerID: bill.CustomerID,
		FileName:   bill.FileName,
		Lines:      lines,
	}
}
