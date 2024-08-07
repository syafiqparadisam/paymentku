package test

import (
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/services/user/config"
	controllerhttp "github.com/syafiqparadisam/paymentku/services/user/controller/http"
	caching_repo "github.com/syafiqparadisam/paymentku/services/user/repository/caching"
	user_repo "github.com/syafiqparadisam/paymentku/services/user/repository/user"
	"github.com/syafiqparadisam/paymentku/services/user/test/seeder"
	"github.com/syafiqparadisam/paymentku/services/user/usecase"
)

type ProfileTestWeb struct {
	Seeder     *seeder.UserSeeder
	Test       *testing.T
	Controller *controllerhttp.ControllerHTTP
	URL        string
	donech     chan bool
}

type Server struct {
	Mysql  *config.MySqlStore
	Routes *controllerhttp.ControllerHTTP
}

func NewServer(mysql *config.MySqlStore, routes *controllerhttp.ControllerHTTP) *Server {
	return &Server{
		Mysql:  mysql,
		Routes: routes,
	}
}

func TestProfileWeb(t *testing.T) {
	envFilePath := "../.env"

	godotenv.Load(envFilePath)

	appPort := os.Getenv("USER_SVC_PORT")
	httpCfg := config.NewHTTPConfig().WithPort(appPort)
	fmt.Println(httpCfg)
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWD")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)

	mysql, errConnMySQL := config.NewMySqlStore(url)
	if errConnMySQL != nil {
		log.Fatal(errConnMySQL)
	}

	redClient, redSync, err := config.NewRedisStore()
	if err != nil {
		log.Fatal(err)
	}

	donech := make(chan bool)
	seeder := seeder.NewUserSeeder(mysql)
	userRepo := user_repo.NewUserRepository(mysql)
	cachingRepo := caching_repo.NewCacheRepo(redSync, redClient)
	usecase := usecase.NewUserUsecase(userRepo, cachingRepo)
	server := controllerhttp.NewControllerHTTP(usecase)
	app := server.Routes()
	go func() {
		app.Listen(httpCfg.Port)
		<-donech
	}()
	pr := NewProfileTestWeb(seeder, t, server, donech, appPort)
	pr.Start()

}

func NewProfileTestWeb(seeder *seeder.UserSeeder, t *testing.T, controller *controllerhttp.ControllerHTTP, donech chan bool, appPort string) *ProfileTestWeb {
	return &ProfileTestWeb{
		Seeder:     seeder,
		Controller: controller,
		donech:     donech,
		Test:       t,
		URL:        fmt.Sprintf("http://localhost%s", appPort),
	}

}

func (pr *ProfileTestWeb) Start() {
	pr.Test.Run("ProfileTest GetProfileById", pr.GetProfileById)
	pr.Test.Run("ProfileTest GetProfileByAccNumber", pr.GetProfileByAccNumber)
	pr.Test.Run("ProfileTest GetProfileByWrongAccountNumber", pr.GetProfileByAccNumberWithWrongAccNum)
	pr.Test.Run("ProfileTest UpdateProfileName", pr.UpdateName)
	pr.Test.Run("ProfileTest UpdateNameWithEmptyString", pr.UpdateNameWithEmptyString)
	pr.Test.Run("ProfileTest UpdateProfileBio", pr.UpdateBio)
	pr.Test.Run("ProfileTest UpdateProfilePhoneNumber", pr.UpdatePhoneNumber)
	pr.Test.Run("ProfileTest UpdateProfileByWrongPhoneNumber", pr.WrongUpdatePhoneNumber)
	pr.Test.Run("ProfileTest UpdatePhoneNumberWithLess10Digit", pr.UpdatePhoneNumberLessThan10Digit)
	go func() {
		pr.donech <- true
		close(pr.donech)
	}()
}
