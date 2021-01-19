package database

import (
	"coco-erp/pdf-service/config"
	"fmt"
	"log"
	"sync"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var once sync.Once
var connection *gorm.DB

//GetConn return the connection instance
func GetConn() *gorm.DB {
	once.Do(func() {
		connection = InitDB()
	})

	return connection
}

//InitDB init the database
func InitDB() *gorm.DB {
	c := config.GetConfiguration()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Paris", c.PGHost, c.PGUser, c.PGPassword, c.PGDB, c.PGPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	log.Println("Connected to database")

	return db
}
