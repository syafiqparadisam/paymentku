package mysqluser

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type MySqlRepository interface {
	GetProfile(string, string) (*Profile, error)
}

type MySqlStore struct {
	db *sql.DB
}

type Profile struct {
	User string
	Balance uint
	Email string
	AccountNumber int64
}

func (s *MySqlStore) GetProfile(usr, email string) (*Profile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 2 * time.Second)
	defer cancel()
	rows, err := s.db.QueryContext(ctx, fmt.Sprintf("SELECT user, balance, email, accountNumber FROM users WHERE user = '%s' AND email = '%s'", usr, email))
	if err != nil {
		return nil, err
	}
	profile := &Profile{}
	if rows.Next() {
		if err := rows.Scan(&profile.User, &profile.Balance, &profile.Email, &profile.AccountNumber); err != nil {
			return nil, err
		}
	}
	return profile, nil
}