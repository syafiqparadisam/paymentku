package config

import (
	"database/sql"

	"github.com/XSAM/otelsql"
	_ "github.com/go-sql-driver/mysql"
	semconv "go.opentelemetry.io/otel/semconv/v1.18.0"
)

type MySqlStore struct {
	Db *sql.DB
}

func NewMySqlStore(mysqlCfg string) (*MySqlStore, error) {
	db, err := otelsql.Open("mysql", mysqlCfg, otelsql.WithAttributes(semconv.DBSystemMySQL))
	db.SetMaxOpenConns(40)
	db.SetMaxIdleConns(40)

	if err != nil {
		return nil, err
	}

	errPingDb := db.Ping()
	if errPingDb != nil {
		return nil, errPingDb
	}

	err = otelsql.RegisterDBStatsMetrics(db, otelsql.WithAttributes(
		semconv.DBSystemMySQL,
	))
	if err != nil {
		return nil, err
	}
	return &MySqlStore{Db: db}, nil
}
