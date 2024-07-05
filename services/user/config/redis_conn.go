package config

import (
	"context"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
)

func NewRedisStore() (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	status := client.Ping(ctx)
	_, err := status.Result()
	if err != nil {
		return nil, err
	}
	return client, nil
}
