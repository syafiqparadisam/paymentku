package caching_repo

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"
	"github.com/go-redsync/redsync/v4"
	"github.com/syafiqparadisam/paymentku/services/user/domain"
)

type CachingInterface interface {
	GetProfile(ctx context.Context, userid int) (*domain.Profile, error)
	InsertProfile(ctx context.Context, profile *domain.Profile) error
}

type Cache struct {
	RedisSync   *redsync.Redsync
	RedisClient *redis.Client
}

func NewCacheRepo(redisSync *redsync.Redsync, redisClient *redis.Client) *Cache {
	return &Cache{RedisSync: redisSync, RedisClient: redisClient}
}

func (c *Cache) GetProfile(ctx context.Context, userid int) (*domain.Profile, error) {
	// lock redis
	mutex := c.RedisSync.NewMutex("user-mutex")
	if err := mutex.Lock(); err != nil {
		return nil, err
	}

	// get cache

	// unlock redis
	if ok, err := mutex.Unlock(); !ok || err != nil {
		return nil, fmt.Errorf("unlock failed %+v", err)
	}

	return nil, nil
}

func (c *Cache) InsertProfile(ctx context.Context, profile *domain.Profile) error {
	// lock redis
	mutex := c.RedisSync.NewMutex("user-mutex")
	if err := mutex.Lock(); err != nil {
		return err
	}

	// set cache

	// unlock redis
	if ok, err := mutex.Unlock(); !ok || err != nil {
		return fmt.Errorf("unlock failed %+v", err)
	}

	return nil
}
