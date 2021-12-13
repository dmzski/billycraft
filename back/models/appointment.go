package models

import (
	"backv2/dtos"
	"time"

	"gorm.io/gorm"
)

type Appointment struct {
	ID          int64 `gorm:"primaryKey;autoIncrement;<-:create"`
	Description string
	CreatedAt   time.Time
	StartDate   time.Time
	EndDate   	time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
	DoneAt      *time.Time
	CompanyID   int     `gorm:"<-:create"`
	CreatedBy   string  `gorm:"foreignKey:Email;<-:create"`
	DoneBy      *string `gorm:"foreignKey:Email"`
}

func (t Appointment) TableName() string {
	return "com_todo"
}

func (t *Appointment) BeforeCreate(tx *gorm.DB) (err error) {
	t.ID = 0
	return
}

func (t Appointment) ToDTO() dtos.Appointment {
	return dtos.Appointment{
		ID:          t.ID,
		Description: t.Description,
		CompanyID:   t.CompanyID,
		CreatedBy:   t.CreatedBy,
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
		DoneBy:      t.DoneBy,
		DoneAt:      t.DoneAt,
	}
}

id?: number
  startDate?: string
  endDate?: string
  description?: string
  quoteId?: string
  billId?: string
  assignees?: string[]
  createdBy?: string
  customerId?: number
  doneBy?: string
  done?: boolean
  name: string