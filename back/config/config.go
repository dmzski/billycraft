package config

import (
	"log"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Profile       string `mapstructure:"PROFILE"`
	DBDriver      string `mapstructure:"DB_DRIVER"`
	DBSource      string `mapstructure:"DB_SOURCE"`
	ServerAddress string `mapstructure:"SERVER_ADDRESS"`
	UploadDir     string `mapstructure:"UPLOAD_DIR"`
}

var (
	appConfig Config
)

func LoadConfig() (config Config, err error) {
	// Load .env config
	if _, err := os.Open("./app.env"); err == nil {
		viper.AddConfigPath(".")
		viper.SetConfigName("app")
		viper.SetConfigType("env")
	}

	// Override with env variable
	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		log.Println("No config file found")
	}

	err = viper.Unmarshal(&config)
	log.Println(config.DBSource)
	appConfig = config
	return
}

func Get() Config {
	return appConfig
}
