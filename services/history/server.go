package main

import (
	"context"
	"fmt"
	"log"
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

// // Initialize a gRPC connection to be used by both the tracer and meter
// // providers.
// func initConn() (*grpc.ClientConn, error) {
// 	// Make a gRPC connection with otel collector.
// 	conn, err := grpc.NewClient("otel-collector:4317",
// 		// Note the use of insecure transport here. TLS is recommended in production.
// 		grpc.WithTransportCredentials(insecure.NewCredentials()),
// 	)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
// 	}

// 	return conn, err
// }

func main() {
	port := ":8801"

	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Failed to load env file")
	}
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbParam := os.Getenv("DB_PARAM")
	url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s", user, pass, host, dbPort, dbName, dbParam)
	mysql, errSql := config.NewMySqlStore(url)
	log := config.Log()
	if errSql != nil {
		log.Fatal().Err(errSql).Msg("Mysql connection is error")
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
	signal.Notify(signalChan, syscall.SIGHUP, syscall.SIGINT, syscall.SIGQUIT, os.Interrupt)

	go func() {
		<-signalChan

		fmt.Println("Shutting down")

		// server shutdown
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		mysql.Db.Close()
		time.Sleep(1 * time.Second)
		server.Shutdown(ctx)

		select {
		case <-time.After(11 * time.Second):
			fmt.Println("Connection still exist, not all connections done")
		case <-ctx.Done():
			fmt.Println("Shutdown successfully")
		}
	}()

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal().Err(err).Msg("Server error")
	}

}
