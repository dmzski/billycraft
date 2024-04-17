package dtos

type User struct {
	Email     string  `json:"email"`
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	CompanyID *string `json:"companyId"`
	Role      string  `json:"role"`
}
