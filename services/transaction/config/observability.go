package config

import (
	"os"

	"github.com/rs/zerolog"
)

func Log() zerolog.Logger {
	loggerOutput := zerolog.ConsoleWriter{Out: os.Stderr}
	logger := zerolog.New(loggerOutput)
	return logger
}
