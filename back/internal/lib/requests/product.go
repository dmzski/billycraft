package requests

type UpdateStockMovement struct {
  Quantity float64 `json:"quantity"`
  ProductID string `json:"productId"`
}

type UpdateStockRequest struct {
  InMovements  []UpdateStockMovement `json:"in"`
  OutMovements []UpdateStockMovement `json:"out"`
}
