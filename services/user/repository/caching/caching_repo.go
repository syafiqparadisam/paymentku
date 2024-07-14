package caching_repo

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/go-redsync/redsync/v4"
	"github.com/syafiqparadisam/paymentku/services/user/domain"
)

type CachingInterface interface {
	GetProfile(ctx context.Context, userid int) (*domain.Profile, error)
	InsertProfile(ctx context.Context, profile *domain.Profile, userid int) error
	DeleteProfile(ctx context.Context, userid int) error
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
	randNum := rand.Intn(1000)
	mutex := c.RedisSync.NewMutex(fmt.Sprintf("user-mutex:%d", randNum))
	if err := mutex.Lock(); err != nil {
		return nil, err
	}

	// get cache
	val, err := c.RedisClient.Get(ctx, fmt.Sprintf("userprofile:%d", userid)).Result()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	profile := &domain.Profile{}
	err = json.Unmarshal([]byte(val), profile)
	if err != nil {
		return nil, err
	}

	// unlock redis
	if ok, err := mutex.Unlock(); !ok || err != nil {
		return nil, fmt.Errorf("unlock failed %+v", err)
	}

	return profile, nil
}

func (c *Cache) InsertProfile(ctx context.Context, profile *domain.Profile, userid int) error {
	// lock redis
	randNum := rand.Intn(1000)
	mutex := c.RedisSync.NewMutex(fmt.Sprintf("user-mutex:%d", randNum))
	if err := mutex.Lock(); err != nil {
		return err
	}

	// set cache
	jsonStr, err := json.Marshal(profile)
	if err != nil {
		return err
	}

	err = c.RedisClient.Set(ctx, fmt.Sprintf("userprofile:%d", userid), jsonStr, 120 * time.Second).Err()
	if err != nil {
		return err
	}

	// unlock redis
	if ok, err := mutex.Unlock(); !ok || err != nil {
		return fmt.Errorf("unlock failed %+v", err)
	}

	return nil
}

func (c *Cache) DeleteProfile(ctx context.Context, userid int) error {
	// lock redis
	randNum := rand.Intn(1000)
	mutex := c.RedisSync.NewMutex(fmt.Sprintf("user-mutex:%d", randNum))
	if err := mutex.Lock(); err != nil {
		return err
	}

	// delete cache
	_, err := c.RedisClient.Del(ctx, fmt.Sprintf("userprofile:%d", userid)).Result()
	if err != nil {
		return err
	}

	// unlock redis
	if ok, err := mutex.Unlock(); !ok || err != nil {
		return fmt.Errorf("unlock failed %+v", err)
	}

	return nil
}
