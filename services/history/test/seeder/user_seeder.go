package seeder

import (
	"fmt"
	"log"

	history_config "github.com/syafiqparadisam/paymentku/services/history/config"
	"github.com/syafiqparadisam/paymentku/services/history/test/mock"
)

type UserSeeder struct {
	MySql *history_config.MySqlStore
}

func NewUserSeeder(mysql *history_config.MySqlStore) *UserSeeder {
	return &UserSeeder{
		MySql: mysql,
	}
}

func (userSeeder *UserSeeder) Up(pr *mock.Profile) (int64, int64) {
	result, errInsertProfile := userSeeder.MySql.Db.Exec("INSERT INTO profile (name, bio, photo_profile, phone_number) VALUES (?, ?, ?, ?)", pr.Name, pr.Bio, pr.PhotoProfile, pr.PhoneNumber)
	if errInsertProfile != nil {
		log.Fatal(errInsertProfile.Error())
	}
	idProfile, _ := result.LastInsertId()
	resultUser, errInsertUser := userSeeder.MySql.Db.Exec("INSERT INTO users (user, email, profileId, accountNumber, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)", pr.User, pr.Email, idProfile, pr.AccountNumber, pr.Balance, pr.CreatedAt)
	fmt.Println(errInsertUser)
	idUser, _ := resultUser.LastInsertId()
	if errInsertUser != nil {
		log.Fatal(errInsertUser.Error())
	}
	fmt.Println("User Seeder has been up")
	return idProfile, idUser
}

func (userSeeder *UserSeeder) Down(idUser int64, idProfile int64) {
	result, errDeleteUser := userSeeder.MySql.Db.Exec("DELETE FROM users WHERE id = ?", idUser)
	if errDeleteUser != nil {
		log.Fatal(errDeleteUser.Error())
	}
	affRowsUser, _ := result.RowsAffected()
	if affRowsUser == 0 {
		panic("Nothing to delete")
	}
	result, errDeleteProfile := userSeeder.MySql.Db.Exec("DELETE FROM profile WHERE id = ?", idProfile)
	if errDeleteProfile != nil {
		log.Fatal(errDeleteProfile.Error())
	}
	affRowsProfile, _ := result.RowsAffected()
	if affRowsProfile == 0 {
		panic("Nothing to delete")
	}
	fmt.Println("User Seeder has been down")
}
