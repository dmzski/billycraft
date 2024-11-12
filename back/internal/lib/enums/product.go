package enums

type ProductType string //@name ProductType

const (
	ProductTypeArticle ProductType = "ARTICLE"
	ProductTypeService ProductType = "SERVICE"
	ProductTypeOther   ProductType = "OTHER_SERVICE"
	ProductTypeText    ProductType = "TEXT"
)
