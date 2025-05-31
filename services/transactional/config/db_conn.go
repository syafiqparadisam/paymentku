package config

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/XSAM/otelsql"
	"github.com/go-redis/redis/v8"
	"github.com/go-redsync/redsync/v4"
	redsyncredis "github.com/go-redsync/redsync/v4/redis/goredis/v8"
	_ "github.com/go-sql-driver/mysql"
	semconv "go.opentelemetry.io/otel/semconv/v1.25.0"
)

type MySqlStore struct {
	Db *sql.DB
}

// RedisStore adalah struct untuk menyimpan client Redis
type RedisStore struct {
	Client *redis.Client
	Ctx    context.Context
	Rs     *redsync.Redsync
}

// NewRedisStore membuat koneksi baru ke Redis dan mengembalikan RedisStore
func NewRedisStore() (*RedisStore, error) {
	// Gunakan context untuk operasi Redis
	ctx := context.Background()

	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")

	// Buat koneksi ke Redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", redisHost, redisPort),
		DB:       0,
	})

	// Uji koneksi dengan perintah PING
	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}
	pool := redsyncredis.NewPool(rdb)
	rs := redsync.New(pool)

	return &RedisStore{
		Client: rdb,
		Ctx:    ctx,
		Rs: rs,
	}, nil
}

func NewMySqlStore() (*MySqlStore, error) {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWD")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)

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
