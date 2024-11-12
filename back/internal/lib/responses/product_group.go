package responses

import (
	"back/internal/lib/models"
	"time"
)

type ProductGroupResponse struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	CompanyID string     `json:"companyId"`
	CreatedBy string     `json:"createdBy"`
	CreatedAt time.Time  `json:"createdAt"`
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
