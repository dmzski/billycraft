package oidc

import (
	"backv2/models"
	"backv2/users"
	"context"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
)

type OidcConfig struct {
	AuthServerURL string
	ClientID      string
	ClientSecret  string
	RedirectURL   string
}

type Claims struct {
	GivenName         string `json:"given_name"`
	FamilyName        string `json:"family_name"`
	PreferredUsername string `json:"preferred_username"`
}

var (
	ctx          context.Context
	verifier     *oidc.IDTokenVerifier
	oauth2Config oauth2.Config
	provider     *oidc.Provider
)

func New(config OidcConfig) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) (err error) {
		rand.Seed(time.Now().UnixNano())
		ctx = context.Background()
		provider, err = oidc.NewProvider(ctx, config.AuthServerURL)
		if err != nil {
			log.Println("Error when creating oidc provider", err.Error(), config.AuthServerURL)
			return
		}
		verifier = provider.Verifier(&oidc.Config{ClientID: "account"})

		// Configure an OpenID Connect aware OAuth2 client.
		oauth2Config = oauth2.Config{
			ClientID:     config.ClientID,
			ClientSecret: config.ClientSecret,
			// Discovery returns the OAuth2 endpoints.
			Endpoint: provider.Endpoint(),

			// "openid" is a required scope for OpenID Connect flows.
			Scopes: []string{oidc.ScopeOpenID, "profile", "email"},
		}

		return c.Next()
	}
}

func Secure() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		rawAccessToken := c.Get("Authorization")
		if rawAccessToken == "" {
			return c.Status(403).SendString("Forbidden access")
		}

		parts := strings.Split(rawAccessToken, " ")
		if len(parts) != 2 {
			return c.Status(400).SendString("Malformed Authorization header")
		}

		_, err := verifier.Verify(ctx, parts[1])
		if err != nil {
			log.Println(err.Error())
			return c.Status(401).SendString("Unauthorized access")
		}

		userInfo, err := provider.UserInfo(ctx, oauth2.StaticTokenSource(&oauth2.Token{
			AccessToken: parts[1],
		}))
		if err != nil {
			return c.Status(500).SendString("Can't retrieve user info")
		}

		c.Locals("userInfo", userInfo)
		claims := &Claims{}
		err = userInfo.Claims(claims)
		if err != nil {
			log.Println("Error when unmarshal claims")
			return c.Status(500).SendString("Error when parsing claims")
		}
		user := users.DAO.FindMe(claims.PreferredUsername)
		if user.Email == "" {
			user = models.User{
				Email:     claims.PreferredUsername,
				FirstName: claims.GivenName,
				LastName:  claims.FamilyName,
				CompanyID: nil,
			}
			users.DAO.SaveUser(user)
		}
		c.Locals("user", user)

		return c.Next()
	}
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func generateRandomString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
