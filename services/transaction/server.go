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
	"github.com/syafiqparadisam/paymentku/services/transaction/config"
	transaction_controllerhttp "github.com/syafiqparadisam/paymentku/services/transaction/controller/http"
	transaction_repo "github.com/syafiqparadisam/paymentku/services/transaction/repository/transaction"
	transaction_usecase "github.com/syafiqparadisam/paymentku/services/transaction/usecase"
)

func main() {
	logZero := config.Log()
	envFilePath := ".env"
	if err := godotenv.Load(envFilePath); err != nil {
		logZero.Fatal().Err(err).Msg("failed load .env file")
	}

	defer func ()  {
		if err := recover();err != nil {
			os.Exit(20)
		}	
	}()
	appPort := os.Getenv("APP_PORT")
	httpCfg := config.NewHTTPConfig().WithPort(appPort)
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)
	mysql, errConnMySQL := config.NewMySqlStore(url)
	if errConnMySQL != nil {
		logZero.Fatal().Err(errConnMySQL).Msg("Mysql connection error")
	}
	fmt.Println("connected to mysql on port ", dbPort)

	topUpRepo := transaction_repo.NewTopUpRepository(mysql)
	transferRepo := transaction_repo.NewTransferRepository(mysql)
	usecase := transaction_usecase.NewTransactionUsecase(transferRepo, topUpRepo)
	controller := transaction_controllerhttp.NewControllerHTTP(usecase)

	server := &http.Server{
		Addr:    httpCfg.Port,
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

		select {
		case <-time.After(11 * time.Second):
			fmt.Println("Connection still exist, not all connections done")
		case <-ctx.Done():
			fmt.Println("Shutdown successfully")
		}
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
	if err != nil && err != http.ErrServerClosed {
		logZero.Fatal().Err(err).Msg("Server error")
	}

}
