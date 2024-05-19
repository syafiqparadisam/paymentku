package config

import "os"

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

func (h *HTTPConfig) GetAllowedOrigin() []string {
	originAllow1 := os.Getenv("ORIGIN_URL")
	h.AllowedOrigin = []string{originAllow1}
	return h.AllowedOrigin
}
