package responses

import (
	"back/internal/lib/models"
	"time"
)

type ProductGroupResponse struct {
  ID        string     `json:"id" validate:"required"`
  Name      string     `json:"name" validate:"required"`
  CompanyID string     `json:"companyId" validate:"required"`
  CreatedBy string     `json:"createdBy" validate:"required"`
  CreatedAt time.Time  `json:"createdAt" validate:"required"`
	UpdatedAt *time.Time `json:"updatedAt"`
}//@name ProductGroupResponse

func CreateProductGroupResponse(group models.ProductGroup) ProductGroupResponse {
	return ProductGroupResponse{
		CreatedAt: group.CreatedAt,
		ID:        group.ID,
		Name:      group.Name,
		CompanyID: group.CompanyID,
		CreatedBy: group.CreatedBy,
		UpdatedAt: group.UpdatedAt,
	}
}
