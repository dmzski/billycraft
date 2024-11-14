package models

import (
	"time"
)

type Todo struct {
	ID          string `gorm:"primaryKey;<-:false;default:uuid_generate_v4()"`
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
	DoneAt      *time.Time
	CompanyID   string  `gorm:"<-:create"`
	CreatedBy   string  `gorm:"foreignKey:Email;<-:create"`
	DoneBy      *string `gorm:"foreignKey:Email"`
}

func (t Todo) TableName() string {
	return "com_todo"
}
