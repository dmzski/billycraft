package models

import (
	"back/internal/lib/dtos"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Bill struct {
	ID         string `gorm:"primaryKey"`
	Name       string `gorm:"<-:create"`
	Title      string
	Tva        *float32
	CreatedAt  time.Time
	UpdatedAt  *time.Time `gorm:"autoUpdateTime"`
	PaidAt     *time.Time
	SentAt     *time.Time
	Status     string
	CreatedBy  string `gorm:"<-:create"`
	CompanyID  string `gorm:"<-:create"`
	CustomerID *string
	FileName   *string
	Company    Company
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

func (Bill) FromDTO(b dtos.Bill) Bill {
	lines := []BillLine{}
	for _, x := range b.Lines {
		x.BillID = ""
		lines = append(lines, BillLine{}.FromDTO(x))
	}

	status := "DRAFT"

	if b.Status != nil {
		status = *b.Status
	}

	return Bill{
		ID:         b.ID,
		Name:       b.Name,
		Title:      b.Title,
		Tva:        b.Tva,
		CreatedAt:  b.CreatedAt,
		UpdatedAt:  b.UpdatedAt,
		PaidAt:     b.PaidAt,
		SentAt:     b.SentAt,
		Status:     status,
		CreatedBy:  b.CreatedBy,
		CompanyID:  b.CompanyID,
		CustomerID: b.CustomerID,
		FileName:   b.FileName,
		Lines:      lines,
	}
}

func (b Bill) FromQuote(q Quote) Bill {
	lines := []BillLine{}
	for _, x := range q.Lines {
		lines = append(lines, BillLine{
			Bill:        b,
			BillID:      b.ID,
			Line:        x.Line,
			Quantity:    x.Quantity,
			Price:       x.Price,
			Name:        x.Name,
			Description: x.Description,
			Type:        x.Type,
		})
	}
	return Bill{
		Title:      q.Title,
		Tva:        q.Tva,
		Status:     "DRAFT",
		CustomerID: q.CustomerID,
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
		Name:       bill.Name,
		Title:      bill.Title,
		Tva:        bill.Tva,
		CreatedAt:  bill.CreatedAt,
		UpdatedAt:  bill.UpdatedAt,
		PaidAt:     bill.PaidAt,
		SentAt:     bill.SentAt,
		Status:     &bill.Status,
		CreatedBy:  bill.CreatedBy,
		CompanyID:  bill.CompanyID,
		CustomerID: bill.CustomerID,
		FileName:   bill.FileName,
		Lines:      lines,
	}
}
