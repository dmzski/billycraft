package enums

type Search int

const (
	SEARCH_QUOTE Search = iota + 1
	SEARCH_BILL
	SEARCH_CUSTOMER
)

func (s Search) String() string {
	return [...]string{"QUOTE", "BILL", "CUSTOMER"}[s-1]
}

func (s Search) Index() int {
	return int(s)
}
