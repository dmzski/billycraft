package enums

type Setting int

const (
	SETTING_HEADER_COLOR Setting = iota + 1
)

func (s Setting) String() string {
	return [...]string{"HEADER_COLOR"}[s-1]
}

func (s Setting) Index() int {
	return int(s)
}
