package dto

type APIResponse[T interface{}] struct {
	StatusCode int    `json:"statusCode"`
	Data       T      `json:"data,omitempty"`
	Message    string `json:"message"`
}
