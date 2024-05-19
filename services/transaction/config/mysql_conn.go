package config

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type MySqlStore struct {
	Db *sql.DB
}

func NewMySqlStore(mysqlCfg string) (*MySqlStore, error) {
	db, err := sql.Open("mysql", mysqlCfg)
	db.SetMaxOpenConns(50)
	db.SetMaxIdleConns(50)
	fmt.Println(err)
	if err != nil {
		return nil, err
	}
	errPingDb := db.Ping()
	if errPingDb != nil {
		return nil, errPingDb
	}
	return &MySqlStore{Db: db}, nil
}
