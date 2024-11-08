package errors

import "errors"

var (
	ErrAffectedRows            = errors.New("nothing to update")
	ErrEmptyField              = errors.New("please fill the fields")
	ErrIsNotNumber             = errors.New("please type number")
	ErrNumberLengthLess11      = errors.New("please type phone number minimal 11 digits")
	ErrFileUploadByUser        = errors.New("error retrieving file")
	ErrMethodNotAllowed        = errors.New("method not allowed")
	ErrUserNoRows              = errors.New("user not found")
	ErrInvalidReqBody          = errors.New("please send a right request")
	ErrInvalidAccountNumber = errors.New("Please enter right account number")
	ErrServer                  = errors.New("sorry, an error occurred while processing your request. Our service is currently experiencing technical issues that we are addressing. Please try again later. If the issue persists, contact our technical support")
)
