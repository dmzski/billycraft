package responses

import (
	"back/internal/lib/models"
	"time"
)

type TodoResponse struct {
  ID          string     `json:"id" validate:"required"`
  Description string     `json:"description" validate:"required"`
  CreatedAt   time.Time  `json:"createdAt" validate:"required"`
  UpdatedAt   time.Time  `json:"updatedAt" validate:"required"`
	DoneAt      *time.Time `json:"doneAt"`
  CompanyID   string     `json:"compagnyId" validate:"required"`
  CreatedBy   string     `json:"createdBy" validate:"required"`
	DoneBy      *string    `json:"doneBy"`
}//@name TodoResponse

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
