package database

import (
	"coco-erp/pdf-service/models"
	"log"
)

func FindQuoteCustomization(id uint64) *models.QuoteCustomization {
	qc := &models.QuoteCustomization{}
	if err := GetConn().First(qc).Error; err != nil {
		log.Println("Error when getting the quote customization")
		return nil
	}
	return qc
}

func FindQuoteCustomizationByCompanyID(id uint64) *models.QuoteCustomization {
	qc := &models.QuoteCustomization{}
	if err := GetConn().First(qc, "company_id = ?", id).Error; err != nil {
		log.Println("Error when getting the quote customization")
		return nil
	}
	return qc
}
