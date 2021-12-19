package models

import (
	"backv2/dtos"
	"time"

	"gorm.io/gorm"
)

type AppointmentAssignee struct {
	AppointmentID int64  `gorm:"primaryKey;autoIncrement:false"`
	Assignee      string `gorm:"primaryKey;autoIncrement:false"`
}

func (t AppointmentAssignee) TableName() string {
	return "com_appointment_assignees"
}

type Appointment struct {
	ID          int64 `gorm:"primaryKey;autoIncrement;<-:create"`
	Name        string
	Description *string
	CreatedAt   time.Time
	StartDate   time.Time
	EndDate     time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
	DoneAt      *time.Time
	CompanyID   int `gorm:"<-:create"`
	CustomerID  *int
	BillID      *string
	QuoteID     *string
	Assignees   []AppointmentAssignee `gorm:"foreignKey:AppointmentID"`
	CreatedBy   string                `gorm:"<-:create"`
	DoneBy      *string               ``
}

func (t Appointment) TableName() string {
	return "com_appointment"
}

func (t *Appointment) BeforeCreate(tx *gorm.DB) (err error) {
	t.ID = 0
	return
}

func (a Appointment) ToDTO() (dto dtos.Appointment) {
	dto = dtos.Appointment{
		ID:          a.ID,
		Description: a.Description,
		CreatedBy:   a.CreatedBy,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
		DoneBy:      a.DoneBy,
		DoneAt:      a.DoneAt,
		Name:        a.Name,
		StartDate:   a.StartDate.Local(),
		EndDate:     a.EndDate.Local(),
		CustomerID:  a.CustomerID,
		BillID:      a.BillID,
		QuoteID:     a.QuoteID,
		Assignees:   make([]string, 0),
	}
	for _, assignee := range a.Assignees {
		dto.Assignees = append(dto.Assignees, assignee.Assignee)
	}
	return dto
}

func (a Appointment) FromDTO(dto dtos.AppointmentRequest) Appointment {
	a = Appointment{
		Description: dto.Description,
		DoneBy:      dto.DoneBy,
		Name:        dto.Name,
		StartDate:   dto.StartDate.Local(),
		EndDate:     dto.EndDate.Local(),
		CustomerID:  dto.CustomerID,
		BillID:      dto.BillID,
		QuoteID:     dto.QuoteID,
		Assignees:   make([]AppointmentAssignee, 0),
	}
	for _, assignee := range dto.Assignees {
		a.Assignees = append(a.Assignees, AppointmentAssignee{Assignee: assignee})
	}

	return a
}
