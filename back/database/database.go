package database

import (
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/gorm"
)

var (
	DBConn *gorm.DB
)

func MakeMigrations() (err error) {
	sql, err := DBConn.DB()
	if err != nil {
		return
	}
	driver, err := postgres.WithInstance(sql, &postgres.Config{})
	if err != nil {
		return
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations/",
		"postgres", driver)
	if err != nil {
		return
	}
	err = m.Migrate(31)
	return
}
