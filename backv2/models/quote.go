package models

import (
	"backv2/dtos"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type Quote struct {
	ID         string `gorm:"primaryKey;<-:create"`
	Title      string
	Tva        *int
	CreatedAt  time.Time
	UpdatedAt  *time.Time `gorm:"autoUpdateTime"`
	SentAt     *time.Time
	Status     string
	CreatedBy  string
	CompanyID  int `gorm:"<-:create"`
	CustomerID *int
	FileName   *string
	Company    Company
	Customer   *Customer
	Lines      []QuoteLine
}

func (Quote) TableName() string {
	return "compta.com_quote"
}

func (q *Quote) BeforeCreate(tx *gorm.DB) (err error) {
	tx.Omit("Company", "Customer")
	q.CreatedAt = time.Now()
	q.UpdatedAt = nil
	q.SentAt = nil
	q.FileName = nil
	var lastId int
	idTx := tx.Raw("SELECT COUNT(*) AS num FROM compta.com_quote WHERE company_id = ?", q.CompanyID).Scan(&lastId)
	if idTx.Error != nil {
		log.Fatalln("Cannot select last id : ", idTx.Error.Error())
		err = idTx.Error
		return
	}
	q.ID = fmt.Sprintf("%d_%s_D%d", q.CompanyID, time.Now().Format("020106"), lastId+1)
	return
}

func (q *Quote) BeforeUpdate(tx *gorm.DB) (err error) {
	tx.Statement.Omit("Company", "Customer")
	return
}

func (Quote) FromDTO(q dtos.Quote) Quote {
	lines := []QuoteLine{}
	for _, x := range q.Lines {
		x.QuoteID = ""
		lines = append(lines, QuoteLine{}.FromDTO(x))
	}
	return Quote{
		ID:         q.ID,
		Title:      q.Title,
		Tva:        q.Tva,
		CreatedAt:  q.CreatedAt,
		UpdatedAt:  q.UpdatedAt,
		SentAt:     q.SentAt,
		Status:     q.Status,
		CreatedBy:  q.CreatedBy,
		CompanyID:  q.CompanyID,
		CustomerID: q.CustomerID,
		FileName:   q.FileName,
		Lines:      lines,
	}
}

func (quote Quote) ToDTO() dtos.Quote {
	lines := []dtos.QuoteLine{}
	for _, x := range quote.Lines {
		lines = append(lines, x.ToDTO())
	}
	return dtos.Quote{
		ID:         quote.ID,
		Title:      quote.Title,
		Tva:        quote.Tva,
		CreatedAt:  quote.CreatedAt,
		UpdatedAt:  quote.UpdatedAt,
		SentAt:     quote.SentAt,
		Status:     quote.Status,
		CreatedBy:  quote.CreatedBy,
		CompanyID:  quote.CompanyID,
		CustomerID: quote.CustomerID,
		FileName:   quote.FileName,
		Lines:      lines,
	}
}
