package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/services/history/config"
	controller_http "github.com/syafiqparadisam/paymentku/services/history/controller/http"
	history_repo "github.com/syafiqparadisam/paymentku/services/history/repository/history"
	"github.com/syafiqparadisam/paymentku/services/history/usecase"
)

func main() {
	logZero := config.Log()
	if err := godotenv.Load(".env"); err != nil {
		logZero.Fatal().Err(err).Msg("Failed to load env file")
	}
	defer func() {
		if err := recover(); err != nil {
			os.Exit(20)
		}
	}()

	port := os.Getenv("APP_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)
	mysql, errSql := config.NewMySqlStore(url)
	if errSql != nil {
		logZero.Fatal().Err(errSql).Msg("Mysql connection is error")
	}
	fmt.Println("connected to mysql on port", dbPort)

	tfRepo := history_repo.NewTransferRepository(mysql)
	topUpRepo := history_repo.NewTopUpRepository(mysql)
	usecase := usecase.NewHistoryUsecase(tfRepo, topUpRepo)
	cfg := config.NewHTTPConfig().WithPort(port)
	controller := controller_http.NewControllerHTTP(usecase, cfg)

	server := &http.Server{
		Addr:    cfg.Port,
		Handler: controller.Routes(),
	}

	signalChan := make(chan os.Signal, 1)
	errch := make(chan error, 1)
	signal.Notify(signalChan, syscall.SIGHUP, syscall.SIGINT, syscall.SIGQUIT, syscall.SIGTERM, os.Interrupt)

	go func() {
		<-signalChan
		fmt.Println("Shutting down")
		// server shutdown
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		errch <- mysql.Db.Close()
		errch <- server.Shutdown(ctx)

		
		<-ctx.Done()
			fmt.Println("Shutdown successfully")
		close(errch)
	}()

	defer func() {
		for e := range errch {
			if e != nil {
				logZero.Err(e).Msg("error shutdowning app")
				panic(e)
			}
		}
		os.Remove("server")
	}()

	err := server.ListenAndServe()

	if err != nil && err != http.ErrServerClosed{
		logZero.Fatal().Err(err).Msg("Server error")
	}

}
