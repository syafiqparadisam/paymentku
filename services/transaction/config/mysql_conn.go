package config

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

type MySqlStore struct {
	Db *sql.DB
}

func NewMySqlStore(mysqlCfg string) (*MySqlStore, error) {
	db, err := sql.Open("mysql", mysqlCfg)
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(20)
	if err != nil {
		return nil, err
	}
	errPingDb := db.Ping()
	if errPingDb != nil {
		return nil, errPingDb
	}
	return &MySqlStore{Db: db}, nil
}
