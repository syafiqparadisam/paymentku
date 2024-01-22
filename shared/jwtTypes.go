package shared

import "github.com/golang-jwt/jwt"

type UserJwtDecode struct {
	User  string `json:"user"`
	Email string `json:"email"`
	jwt.StandardClaims
}
