package errors

import "errors"

var (
	ErrNothingToDel     = errors.New("nothing to delete")
	ErrAffectedRows     = errors.New("nothing to update")
	ErrEmptyField       = errors.New("please fill the fields")
	ErrMethodNotAllowed = errors.New("method not allowed")
	ErrUserNoRows       = errors.New("user not found")
	ErrInvalidReqBody   = errors.New("please send a right request")
	ErrHistoryNoRows    = errors.New("history not found")
	ErrServer           = errors.New("sorry, an error occurred while processing your request. Our service is currently experiencing technical issues that we are addressing. Please try again later. If the issue persists, contact our technical support")
)
