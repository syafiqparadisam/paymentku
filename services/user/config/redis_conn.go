package config

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/go-redsync/redsync/v4"
	"github.com/go-redsync/redsync/v4/redis/goredis/v8"
)

func NewRedisStore() (*redis.Client, *redsync.Redsync, error) {
	client := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	status := client.Ping(ctx)
	code, err := status.Result()

	fmt.Println(code)

	if err != nil {
		return nil, nil, err
	}

	pool := goredis.NewPool(client)
	rsync := redsync.New(pool)

	return client, rsync, nil
}
