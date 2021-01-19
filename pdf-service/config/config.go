package config

import (
	"log"
	"sync"

	"github.com/kelseyhightower/envconfig"
)

var once sync.Once
var c *Config

type Config struct {
	Host       string `default:"localhost" split_words:"true"`
	Port       string `default:"8080" split_words:"true"`
	PGUser     string `default:"postgres" envconfig:"PG_USER"`
	PGPassword string `default:"postgres" envconfig:"PG_PASSWORD"`
	PGDB       string `default:"bugs" envconfig:"pg_db"`
	PGHost     string `default:"localhost" envconfig:"pg_host"`
	PGPort     string `default:"5432" envconfig:"pg_port"`
}

func LoadConfiguration() *Config {
	var c Config
	err := envconfig.Process("app", &c)
	if err != nil {
		log.Println("Error when loading configuration", err.Error())
	}
	return &c
}

func GetConfiguration() *Config {
	once.Do(func() {
		c = LoadConfiguration()
	})
	return c
}
