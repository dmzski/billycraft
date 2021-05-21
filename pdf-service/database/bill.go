package database

import (
	"coco-erp/pdf-service/models"
	"log"
)

func FindBill(billId string) *models.Bill {
	bill := &models.Bill{ID: billId}
	if err := GetConn().Preload("Customer").Preload("Lines").First(bill).Error; err != nil {
		log.Println("Error when getting the bill")
		return nil
	}
	return bill
}
