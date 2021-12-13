package dtos

import "time"

type Appointment struct {
	ID          int64      `json:"id"`
	Description string     `json:"description"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DoneAt      *time.Time `json:"doneAt"`
	CompanyID   int        `json:"compagnyId"`
	CreatedBy   string     `json:"createdBy"`
	DoneBy      *string    `json:"doneBy"`
}

type AppointmentRequest struct {
	Description string
}
