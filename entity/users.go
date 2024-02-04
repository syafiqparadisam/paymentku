package entity

type Users struct {
	Id    int
	User  string
	Pass  string
	Email string
	HistoryId int
	TokenId int
	Bio string
	ProfilePicture string
	PhoneNumber int
}


type RefreshToken struct {
	TokenId int
	RefreshToken []string
}
