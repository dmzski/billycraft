package models

import (
	"back/internal/lib/dtos"
	"time"
)

type Todo struct {
	ID          string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
	DoneAt      *time.Time
	CompanyID   string     `gorm:"<-:create"`
	CreatedBy   string  `gorm:"foreignKey:Email;<-:create"`
	DoneBy      *string `gorm:"foreignKey:Email"`
}

func (t Todo) TableName() string {
	return "com_todo"
}

func (t Todo) ToDTO() dtos.TodoResponse {
	return dtos.TodoResponse{
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
