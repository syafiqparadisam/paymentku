package shared

type APIResponse struct {
	StatusCode int    `json:"statusCode"`
	Data       any    `json:"data"`
	Message    any    `json:"message"`
	Error      string `json:"error"`
}
