package responses

import (
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"time"
)

type BillResponse struct {
	ID         string             `json:"id"`
	Title      string             `json:"title"`
	Name       string             `json:"name"`
	Tva        *float32           `json:"tva"`
	CreatedAt  time.Time          `json:"createdAt"`
	UpdatedAt  *time.Time         `json:"updatedAt"`
	PaidAt     *time.Time         `json:"paidAt"`
	SentAt     *time.Time         `json:"sentAt"`
	Status     enums.BillStatus   `json:"status"`
	CreatedBy  string             `json:"createdBy"`
	CompanyID  string             `json:"companyId"`
	CustomerID *string            `json:"customerId"`
	FileName   *string            `json:"fileName"`
	Lines      []BillLineResponse `json:"lines"`
}//@name BillResponse

type BillLineResponse struct {
	BillID      string            `json:"billId"`
	Line        int               `json:"line"`
	Quantity    float64           `json:"quantity"`
	Price       float64           `json:"price"`
	Name        string            `json:"name"`
	Description *string           `json:"description"`
	Type        enums.ProductType `json:"type"`
	ProductID   *string           `json:"productId"`
}//@name BillLineResponse

type BillResponseList struct {
	Bills      []BillResponse `json:"bills"`
	TotalCount int            `json:"totalCount"`
}//@name BillResponseList

func createBillLineResponse(line models.BillLine) BillLineResponse {
	return BillLineResponse{
		BillID:      line.BillID,
		Line:        line.Line,
		Quantity:    line.Quantity,
		Price:       line.Price,
		Name:        line.Name,
		Description: line.Description,
		Type:        line.Type,
		ProductID:   line.ProductID,
	}
}

func CreateBillResponse(bill models.Bill) BillResponse {
	lines := []BillLineResponse{}
	for _, x := range bill.Lines {
		lines = append(lines, createBillLineResponse(x))
	}
	return BillResponse{
		ID:         bill.ID,
		Name:       bill.Name,
		Title:      bill.Title,
		Tva:        bill.Tva,
		CreatedAt:  bill.CreatedAt,
		UpdatedAt:  bill.UpdatedAt,
		SentAt:     bill.SentAt,
		Status:     bill.Status,
		CreatedBy:  bill.CreatedBy,
		CompanyID:  bill.CompanyID,
		CustomerID: bill.CustomerID,
		FileName:   bill.FileName,
		Lines:      lines,
	}
}

func CreateBillResponseList(quotes []models.Bill) BillResponseList {
	list := []BillResponse{}
	for _, quote := range quotes {
		list = append(list, CreateBillResponse(quote))
	}

	return BillResponseList{
		Bills:      list,
		TotalCount: len(list),
	}

}
