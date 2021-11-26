package config

import (
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Profile           string `mapstructure:"PROFILE"`
	DBDriver          string `mapstructure:"DB_DRIVER"`
	DBSource          string `mapstructure:"DB_SOURCE"`
	ServerAddress     string `mapstructure:"SERVER_ADDRESS"`
	CorsOrigins       string `mapstructure:"CORS_ORIGINS"`
	CorsHeaders       string `mapstructure:"CORS_HEADERS"`
	CorsAccept        string `mapstructure:"CORS_ACCEPT"`
	CorsMethods       string `mapstructure:"CORS_METHODS"`
	OIDCAuthServerUrl string `mapstructure:"OIDC_AUTH_SERVER_URL"`
	OIDCCLientId      string `mapstructure:"OIDC_CLIENT_ID"`
	OIDCClientSecret  string `mapstructure:"OIDC_CLIENT_SECRET"`
	OIDCIssuer        string `mapstructure:"OIDC_ISSUER"`
	UploadDir         string `mapstructure:"UPLOAD_DIR"`
	PdfDir            string `mapstructure:"PDF_DIR"`
	MailerFrom        string `mapstructure:"MAILER_FROM"`
	MailerHost        string `mapstructure:"MAILER_HOST"`
	MailerPort        string `mapstructure:"MAILER_PORT"`
	MailerSSL         string `mapstructure:"MAILER_SSL"`
	MailerUsername    string `mapstructure:"MAILER_USERNAME"`
	MailerPassword    string `mapstructure:"MAILER_PASSWORD"`
	MailerMock        string `mapstructure:"MAILER_MOCK"`
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
		return
	}

	err = viper.Unmarshal(&config)
	appConfig = config
	return
}

func Get() Config {
	return appConfig
}
