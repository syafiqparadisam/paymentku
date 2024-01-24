package mysqlhistory

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type MySqlRepository interface {
	FindIdByName(string) (*UserId, error)
}

type UserId struct {
	Id int
}

type MySqlStore struct {
	db *sql.DB
}

func (s *MySqlStore) FindIdByName(user string) (*UserId, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := fmt.Sprintf("select id from users where user = '%s'", user)
	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	userId := &UserId{}
	if rows.Next() {
		if err := rows.Scan(&userId.Id); err != nil {
			return nil, err
		}
		return userId, nil
	}
	return nil, fmt.Errorf("can't scanning rows")
}
