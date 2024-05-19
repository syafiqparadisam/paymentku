package config

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type MySqlStore struct {
	Db *sql.DB
}

func NewMySqlStore(url string) (*MySqlStore, error) {
	db, err := sql.Open("mysql", url)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}
	db.SetMaxOpenConns(40)
	db.SetMaxIdleConns(40)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*4)
	defer cancel()
	errPingDb := db.PingContext(ctx)
	if errPingDb != nil {
		return nil, errPingDb
	}
	return &MySqlStore{Db: db}, nil
}
