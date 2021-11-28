package dtos

type SearchResult struct {
	Id          string `json:"id"`
	Description string `json:"description"`
}

type Search struct {
	Category string         `json:"category"`
	Results  []SearchResult `json:"results"`
}
