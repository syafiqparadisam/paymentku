package mock

import (
	"math/rand"
	"time"

	user_domain "github.com/syafiqparadisam/paymentku/services/user/domain"
)

func generateRandomString(length int) string {
	result := make([]byte, length)
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}

func generateRandomPhoneNumber() string {
	result := make([]byte, 12)
	char := "0123456789"
	for r := range result {
		result[r] = char[rand.Intn(len(char))]
	}
	return string(result)
}

func NewUser1ProfileMock() *user_domain.Profile {
	accNum := uint64(rand.Intn(100000))
	phone := "0" + generateRandomPhoneNumber()
	bio := "Hllo broo im a programmer"
	photo := "https://placehold.co/100x100"
	return &user_domain.Profile{
		User:          generateRandomString(34),
		Email:         generateRandomString(50) + "@gmail.com",
		AccountNumber: accNum,
		CreatedAt:     time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
		Name:          "afiq",
		Balance:       100000,
		PhoneNumber:   &phone,
		Bio:           &bio,
		PhotoProfile:  photo,
	}
}

func NewUser2ProfileMock() *user_domain.Profile {
	accNum := uint64(rand.Intn(100000))
	phone := "0" + generateRandomPhoneNumber()
	bio := "Hllo broo im a programmer"
	photo := "https://placehold.co/100x100"
	return &user_domain.Profile{
		User:          generateRandomString(34),
		Email:         generateRandomString(50) + "@gmail.com",
		AccountNumber: accNum,
		CreatedAt:     time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
		Name:          "rull",
		PhoneNumber:   &phone,
		Balance:       100000,
		Bio:           &bio,
		PhotoProfile:  photo,
	}
}
