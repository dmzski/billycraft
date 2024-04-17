package models

import (
	"back/internal/lib/dtos"
	"time"
)

type Setting struct {
	ID        string `gorm:"primaryKey"`
	Value     string
	CreatedAt time.Time
	UpdatedAt *time.Time `gorm:"autoUpdateTime"`
	CompanyID string
	Company   Company
}

func (Setting) TableName() string {
	return "com_setting"
}

func (s Setting) ToDTO() dtos.Setting {
	return dtos.Setting{
		ID:        s.ID,
		Value:     s.Value,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
		CompanyID: s.CompanyID,
	}
}

func (Setting) FromDTO(s dtos.Setting) Setting {
	return Setting{
		ID:        s.ID,
		Value:     s.Value,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
		CompanyID: s.CompanyID,
	}
}
