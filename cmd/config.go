package main

type MicroService struct {}

type Microservice interface {
	TransactionServer(string) error
}