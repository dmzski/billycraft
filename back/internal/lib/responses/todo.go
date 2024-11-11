package responses

import (
	"back/internal/lib/models"
	"time"
)

type TodoResponse struct {
	ID          string     `json:"id"`
	Description string     `json:"description"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DoneAt      *time.Time `json:"doneAt"`
	CompanyID   string     `json:"compagnyId"`
	CreatedBy   string     `json:"createdBy"`
	DoneBy      *string    `json:"doneBy"`
}

func CreateTodoResponse(t models.Todo) TodoResponse {
	return TodoResponse{
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
