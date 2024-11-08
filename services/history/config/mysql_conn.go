package config

import (
	"context"
	"database/sql"
	"time"

	"github.com/XSAM/otelsql"
	_ "github.com/go-sql-driver/mysql"
	semconv "go.opentelemetry.io/otel/semconv/v1.25.0"
)

type MySqlStore struct {
	Db *sql.DB
}

func NewMySqlStore(url string) (*MySqlStore, error) {
	db, err := otelsql.Open("mysql", url, otelsql.WithAttributes(semconv.DBSystemMySQL))
	if err != nil {
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
	err = otelsql.RegisterDBStatsMetrics(db, otelsql.WithAttributes(semconv.DBSystemMySQL))
	if err != nil {
		return nil, err
	}
	return &MySqlStore{Db: db}, nil
}
