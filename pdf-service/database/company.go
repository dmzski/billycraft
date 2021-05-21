package database

import (
	"coco-erp/pdf-service/models"
	"log"
)

func FindCompany(id int32) *models.Company {
	company := &models.Company{}
	if err := GetConn().First(company).Error; err != nil {
		log.Println("Error when getting the company")
		return nil
	}
	return company
}
