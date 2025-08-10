package services

import (
	"net/url"
	"strings"
)

func ProcessURL(originalURL string, operation string) (string, error) {
	parsed, err := url.Parse(originalURL)
	if err != nil {
		return "", err
	}

	switch strings.ToLower(operation) {
	case "canonical":
		return canonicalize(parsed), nil
	case "redirection":
		return redirectize(parsed), nil
	case "all":
		return redirectize(parsed), nil // redirectize() already applies canonical steps internally
	default:
		return "", ErrInvalidOperation
	}
}

func canonicalize(u *url.URL) string {
	u.RawQuery = "" // remove query params
	u.Fragment = ""
	u.Path = strings.TrimSuffix(u.Path, "/") // remove trailing slash
	return u.String()
}

func redirectize(u *url.URL) string {
	// Force domain to www.byfood.com
	u.Scheme = "https"
	u.Host = "www.byfood.com"

	// Lowercase everything except scheme
	u.Host = strings.ToLower(u.Host)
	u.Path = strings.ToLower(u.Path)

	// Apply canonical cleanup
	return canonicalize(u)
}

// Custom error for invalid operations
var ErrInvalidOperation = &OperationError{"invalid operation type"}

type OperationError struct {
	Msg string
}

func (e *OperationError) Error() string {
	return e.Msg
}
