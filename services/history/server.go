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
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.25.0"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func initializeGRPCConnection() (*grpc.ClientConn, error) {
	grpcServerUrl := os.Getenv("GRPC_SERVER_URL")

	conn, err := grpc.NewClient(grpcServerUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("failed to connect grpc server %w", err)
	}
	return conn, nil
}

func initTracerProvider(ctx context.Context, conn *grpc.ClientConn) (*sdktrace.TracerProvider, error) {
	res, err := resource.New(ctx, resource.WithAttributes(semconv.ServiceNameKey.String("tracer-history")))
	if err != nil {
		return nil, fmt.Errorf("failed to create resource")
	}

	traceExporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(conn))
	if err != nil {
		return nil, fmt.Errorf("failed to create trace exporter %w", err)
	}

	bsp := sdktrace.NewBatchSpanProcessor(traceExporter)
	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithResource(res),
		sdktrace.WithSpanProcessor(bsp),
	)
	otel.SetTracerProvider(tracerProvider)
	otel.SetTextMapPropagator(propagation.TraceContext{})
	return tracerProvider, nil
}

func initMeterProvider(ctx context.Context, conn *grpc.ClientConn) (*sdkmetric.MeterProvider, error) {
	res, err := resource.New(ctx, resource.WithAttributes(semconv.ServiceNameKey.String("metric-history")))
	if err != nil {
		return nil, fmt.Errorf("failed to create tracer provider %w", err)
	}

	metricExporter, err := otlpmetricgrpc.New(ctx, otlpmetricgrpc.WithGRPCConn(conn))
	if err != nil {
		return nil, fmt.Errorf("failed to create meter provider %w", err)
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExporter)),
		sdkmetric.WithResource(res),
	)
	otel.SetMeterProvider(meterProvider)

	return meterProvider, nil
}

func main() {
	godotenv.Load(".env")
	logZero := config.Log()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	conn, err := initializeGRPCConnection()
	if err != nil {
		logZero.Fatal().Err(err).Msg("Connect to grpc error")
	}

	tracerProvider, err := initTracerProvider(ctx, conn)
	if err != nil {
		logZero.Fatal().Err(err).Msg("Tracer provider error")
	}
	meterProvider, err := initMeterProvider(ctx, conn)
	if err != nil {
		logZero.Fatal().Err(err).Msg("Meter provider error")
	}

	port := os.Getenv("APP_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWD")
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
		fmt.Println("db already closed")
		errch <- server.Shutdown(ctx)
		fmt.Println("server already closed")
		errch <- tracerProvider.Shutdown(ctx)
		fmt.Println("tracer provider already closed")
		errch <- meterProvider.Shutdown(ctx)
		fmt.Println("metric provider already closed")

		select {
		case <-ctx.Done():
			fmt.Println("Shutdown successfully")
		case <-time.After(11 * time.Second):
			fmt.Println("still has connection, not successfully shutdown")
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
		os.Remove("server.out")
	}()

	err = server.ListenAndServe()

	if err != nil && err != http.ErrServerClosed {
		logZero.Fatal().Err(err).Msg("Server error")
	}

}
