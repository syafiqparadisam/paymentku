package config

type HTTPConfig struct {
	Port          string
	AllowedOrigin []string
}

func NewHTTPConfig() *HTTPConfig {
	return &HTTPConfig{}
}

func (h *HTTPConfig) WithPort(port string) *HTTPConfig {
	h.Port = port
	return h
}
