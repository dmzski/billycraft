package database

import (
	"coco-erp/pdf-service/models"
	"log"
)

func FindQuote(quoteId string) *models.Quote {
	quote := &models.Quote{ID: quoteId}
	if err := GetConn().Preload("Customer").Preload("Lines").First(quote).Error; err != nil {
		log.Println("Error when getting the quote")
		return nil
	}
	return quote
}
