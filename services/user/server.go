package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	"github.com/syafiqparadisam/paymentku/services/user/config"
	controllerhttp "github.com/syafiqparadisam/paymentku/services/user/controller/http"
	user_repo "github.com/syafiqparadisam/paymentku/services/user/repository/user"
	"github.com/syafiqparadisam/paymentku/services/user/usecase"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.18.0"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var serviceName = semconv.ServiceNameKey.String("otlp-user")

// Initialize a gRPC connection to be used by both the tracer and meter
// providers.
func initConn() (*grpc.ClientConn, error) {
	grpcServerUrl := os.Getenv("GRPC_SERVER_URL")
	// Make a gRPC connection with otel collector.
	conn, err := grpc.NewClient(grpcServerUrl,
		// Note the use of insecure transport here. TLS is recommended in production.
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
	}

	return conn, nil
}

// Initializes an OTLP exporter, and configures the corresponding trace providers.
func initTracerProvider(ctx context.Context, conn *grpc.ClientConn) (*sdktrace.TracerProvider, error) {
	res, err := resource.New(ctx,
		resource.WithAttributes(
			// the service name used to display traces in backends
			serviceName,
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create resource: %w", err)
	}

	// Set up a trace exporter
	traceExporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(conn))
	if err != nil {
		return nil, fmt.Errorf("failed to create trace exporter: %w", err)
	}

	// Register the trace exporter with a TracerProvider, using a batch
	// span processor to aggregate spans before export.
	bsp := sdktrace.NewBatchSpanProcessor(traceExporter)
	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithResource(res),
		sdktrace.WithSpanProcessor(bsp),
	)
	otel.SetTracerProvider(tracerProvider)

	// set global propagator to tracecontext (the default is no-op).
	otel.SetTextMapPropagator(propagation.TraceContext{})

	// Shutdown will flush any remaining spans and shut down the exporter.
	return tracerProvider, nil
}

// Initializes an OTLP exporter, and configures the corresponding meter
// provider.
func initMeterProvider(ctx context.Context, conn *grpc.ClientConn) (*sdkmetric.MeterProvider, error) {
	res, err := resource.New(ctx,
		resource.WithAttributes(
			// the service name used to display traces in backends
			serviceName,
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create resource: %w", err)
	}

	metricExporter, err := otlpmetricgrpc.New(ctx, otlpmetricgrpc.WithGRPCConn(conn))
	if err != nil {
		return nil, fmt.Errorf("failed to create metrics exporter: %w", err)
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExporter)),
		sdkmetric.WithResource(res),
	)
	otel.SetMeterProvider(meterProvider)

	return meterProvider, nil
}

func main() {
	envFilePath := ".env"
	if err := godotenv.Load(envFilePath); err != nil {
		fmt.Println("Failed to load env file")
	}

	ctx,cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()

	logZero := config.Log()
	conn, err := initConn()
	if err != nil {
		logZero.Fatal().Err(err).Msg("Connection grpc error")
	}

	tracerProvider, err := initTracerProvider(ctx, conn)
	if err != nil {
		logZero.Fatal().Err(err).Msg("Tracer provider error")
	}

	metricProvider, err := initMeterProvider(ctx, conn)
	if err != nil {
		logZero.Fatal().Err(err).Msg("Meter provider error")
	}

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

	fmt.Println("Connected to mysql on port ", dbPort)

	userRepo := user_repo.NewUserRepository(mysql)
	usecase := usecase.NewUserUsecase(userRepo)

	server := controllerhttp.NewControllerHTTP(usecase)
	app := server.Routes()

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
		errch <- tracerProvider.Shutdown(ctx)
		errch <- metricProvider.Shutdown(ctx)
		errch <- app.ShutdownWithContext(ctx)

		<-ctx.Done()
		fmt.Println("Shutdown successfully")
		close(errch)
	}()

	defer func() {
		for e := range errch {
			fmt.Println(e)
			if e != nil {
				logZero.Err(e).Msg("error shutdowning app")
			}
		}
		os.Remove("server")
	}()
	err = app.Listen(httpCfg.Port)
	if err != nil {
		logZero.Fatal().Err(err).Msg("Server error")
	}

}
