package shared

import (
	"fmt"
	"os"
	"github.com/golang-jwt/jwt"
)


func VerifyAuth(token string) (*UserJwtDecode, error) {
	var secretKey = os.Getenv("JWT_SECRET")
	fmt.Println(secretKey)
	claims := &UserJwtDecode{}
	tokenjwt, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(secretKey),nil
	})
	if err != nil {
		return nil, err
	}
	if tokenjwt.Valid {
		claims, ok := tokenjwt.Claims.(*UserJwtDecode)
		if !ok {
			return nil, fmt.Errorf("error parsing to map")
		}
		
		return claims, nil
	} else {
		return nil, fmt.Errorf("token tidak valid")
	}
}
