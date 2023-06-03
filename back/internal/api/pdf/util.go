package pdf

import (
	"back/internal/lib/models"
	"errors"
	"fmt"
	"image/color"
)

var errInvalidFormat = errors.New("invalid format")

func parseHexColor(s string) (c color.RGBA, err error) {
	c.A = 0xff

	if s == "" || s[0] != '#' {
		return c, errInvalidFormat
	}

	hexToByte := func(b byte) byte {
		switch {
		case b >= '0' && b <= '9':
			return b - '0'
		case b >= 'a' && b <= 'f':
			return b - 'a' + 10
		case b >= 'A' && b <= 'F':
			return b - 'A' + 10
		}
		err = errInvalidFormat
		return 0
	}

	switch len(s) {
	case 7:
		c.R = hexToByte(s[1])<<4 + hexToByte(s[2])
		c.G = hexToByte(s[3])<<4 + hexToByte(s[4])
		c.B = hexToByte(s[5])<<4 + hexToByte(s[6])
	case 4:
		c.R = hexToByte(s[1]) * 17
		c.G = hexToByte(s[2]) * 17
		c.B = hexToByte(s[3]) * 17
	default:
		err = errInvalidFormat
	}
	return
}

func getCompagnyStr(c models.Company, displayCompanyEmail bool, displayCompanyPhoneNumber bool) string {

	companyStr := fmt.Sprintf("%s\n%s\n%s, %s", c.Name, c.Address, c.PostalCode, c.City)
	if displayCompanyEmail {
		companyStr += fmt.Sprintf("\n%s", c.Email)
	}
	if displayCompanyPhoneNumber {
		companyStr += fmt.Sprintf("\n%s", c.PhoneNumber)
	}

  companyStr += fmt.Sprintf("\nSIRET: %s", c.Siret)

  return companyStr
}
