package models

import (
	"backv2/internal/lib/dtos"
	"time"

	"gorm.io/gorm"
)

type Todo struct {
	ID          int64 `gorm:"primaryKey;autoIncrement;<-:create"`
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
	DoneAt      *time.Time
	CompanyID   int     `gorm:"<-:create"`
	CreatedBy   string  `gorm:"foreignKey:Email;<-:create"`
	DoneBy      *string `gorm:"foreignKey:Email"`
}

func (t Todo) TableName() string {
	return "com_todo"
}

func (t *Todo) BeforeCreate(tx *gorm.DB) (err error) {
	t.ID = 0
	return
}

func (t Todo) ToDTO() dtos.Todo {
	return dtos.Todo{
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
