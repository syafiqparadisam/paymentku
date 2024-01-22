package db

type Users struct {
	Id            int
	User          string
	RefreshToken  string
	Pass          string
	Email         string
	AccountNumber uint64
	Balance       int
}
