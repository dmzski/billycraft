package database

import (
	"coco-erp/pdf-service/models"
	"log"
)

func FindCustomer(id uint64) *models.Customer {
	customer := models.Customer{}
	if err := GetConn().First(customer).Error; err != nil {
		log.Println("Error when getting customer")
		return nil
	}
	return &customer
}
