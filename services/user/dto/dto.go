package dto

type UpdateBioDTO struct {
	Bio string `json:"bio"`
}

type UpdatePhotoProfileDTO struct {
	PhotoProfile string `json:"photoProfile"`
}

type UpdatePhoneNumberDTO struct {
	PhoneNumber string `json:"phoneNumber"`
}

type UpdateNameDTO struct {
	Name string `json:"name"`
}

type UpdateUsername struct {
	User string `json:"username"`
}

type FindUserByAccNumber struct {
	AccountNumber uint64 `json:"accountNumber"`
}

type XUserData struct {
	UserId string `json:"user_id"`
}
