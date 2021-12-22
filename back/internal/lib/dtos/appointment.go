package dtos

import (
	"time"
)

type Appointment struct {
	ID          int64      `json:"id"`
	Name        string     `json:"name"`
	Description *string    `json:"description"`
	CreatedAt   time.Time  `json:"createdAt"`
	StartDate   time.Time  `json:"startDate"`
	EndDate     time.Time  `json:"endDate"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DoneAt      *time.Time `json:"doneAt"`
	CustomerID  *int       `json:"customerId"`
	BillID      *string    `json:"billId"`
	QuoteID     *string    `json:"quoteId"`
	Assignees   []string   `json:"assignees"`
	CreatedBy   string     `json:"createdBy"`
	DoneBy      *string    `json:"doneBy"`
}

type AppointmentRequest struct {
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	CustomerID  *int      `json:"customerId"`
	BillID      *string   `json:"billId"`
	QuoteID     *string   `json:"quoteId"`
	Assignees   []string  `json:"assignees"`
	DoneBy      *string   `json:"doneBy"`
}
