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
	phone := "0" + generateRandomPhoneNumber()
	bio := "Hllo broo im a programmer"

	return &user_domain.Profile{
		User:          generateRandomString(34),
		Email:         generateRandomString(50) + "@gmail.com",
		AccountNumber: uint64(rand.Intn(100000)),
		CreatedAt:     time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
		Name:          "afiq",
		Balance:       100000,
		PhoneNumber:   &phone,
		Bio:           &bio,
		PhotoProfile:  "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716213116/usericon_hrikn3.jpg",
	}
}

func NewUser2ProfileMock() *user_domain.Profile {
	phone := "0" + generateRandomPhoneNumber()
	bio := "Hllo broo im a programmer"
	return &user_domain.Profile{
		User:          generateRandomString(34),
		Email:         generateRandomString(50) + "@gmail.com",
		AccountNumber:  uint64(rand.Intn(100000)),
		CreatedAt:     time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
		Name:          "rull",
		PhoneNumber:   &phone,
		Balance:       100000,
		Bio:           &bio,
		PhotoProfile:  "https://res.cloudinary.com/dktwq4f3f/image/upload/v1716213116/usericon_hrikn3.jpg",
	}
}
