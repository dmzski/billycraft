package database

import (
	"coco-erp/pdf-service/models"
	"log"
)

func FindBillCustomization(id uint64) *models.BillCustomization {
	qc := &models.BillCustomization{}
	if err := GetConn().First(qc).Error; err != nil {
		log.Println("Error when getting the bill customization")
		return nil
	}
	return qc
}

func FindBillCustomizationByCompanyID(id uint64) *models.BillCustomization {
	bc := &models.BillCustomization{}
	if err := GetConn().First(bc, "company_id = ?", id).Error; err != nil {
		log.Println("Error when getting the bill customization")
		return nil
	}
	return bc
}
