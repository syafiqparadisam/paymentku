package seeder

import (
	"fmt"
	"log"

	user_config "github.com/syafiqparadisam/paymentku/services/user/config"
	user_domain "github.com/syafiqparadisam/paymentku/services/user/domain"
)

type UserSeeder struct {
	MySql *user_config.MySqlStore
}

type User struct {
	Id            int64
	Pass          *string
	Email         string
	User          string
	ProfileId     int64
	AccountNumber uint64
	Balance       int64
	CreatedAt     string
	IdProfile     int64
	Name          string
	Bio           string
	PhotoProfile  string
	PhoneNumber   string
}

func NewUserSeeder(mysql *user_config.MySqlStore) *UserSeeder {
	return &UserSeeder{
		MySql: mysql,
	}
}

func (userSeeder *UserSeeder) Find(idUser int64) *User {
	rows, err := userSeeder.MySql.Db.Query("SELECT * FROM users INNER JOIN profile ON users.profileId = profile.id WHERE users.id = ?", idUser)
	if err != nil {
		panic(err)
	}
	user := &User{}
	if rows.Next() {
		if err := rows.Scan(
			&user.Id,
			&user.Pass,
			&user.Email,
			&user.User,
			&user.ProfileId,
			&user.AccountNumber,
			&user.Balance,
			&user.CreatedAt,
			&user.IdProfile,
			&user.Name,
			&user.Bio,
			&user.PhotoProfile,
			&user.PhoneNumber,
		); err != nil {
			panic(err)
		}
	}
	return user
}

func (userSeeder *UserSeeder) Up(pr *user_domain.Profile) (int64, int64) {
	result, errInsertProfile := userSeeder.MySql.Db.Exec("INSERT INTO profile (name, bio, photo_profile, phone_number) VALUES (?, ?, ?, ?)", pr.Name, *pr.Bio, pr.PhotoProfile, *pr.PhoneNumber)
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
	fmt.Println(idUser)
	fmt.Println(idProfile)
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
