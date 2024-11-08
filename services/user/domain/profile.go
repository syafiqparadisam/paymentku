package domain

type Profile struct {
	User          string  `json:"user"`
	Email         string  `json:"email"`
	AccountNumber uint64  `json:"accountNumber"`
	Balance       int64   `json:"balance"`
	CreatedAt     string  `json:"created_at"`
	Name          string  `json:"name"`
	Bio           *string `json:"bio"`
	PhoneNumber   *string `json:"phoneNumber"`
	PhotoProfile  string  `json:"photo_profile"`
	PhotoPublicId *string `json:"photo_public_id"`
}

type ProfileForFindWithAccount struct {
	User          string `json:"user"`
	AccountNumber uint64 `json:"accountNumber"`
	CreatedAt     string `json:"created_at"`
	Name          string `json:"name"`
	PhotoProfile  string `json:"photo_profile"`
}

type PhotoProfile struct {
	PhotoProfile string `json:"photo_profile"`
}
