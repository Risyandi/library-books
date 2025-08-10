package main

import (
	"library-books/config"
	"library-books/middleware"
	"library-books/routes"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

// @title Library Books API
// @version 1.0
// @description RESTful API for managing library books, users, and related services
// @termsOfService https://swagger.io/terms/
// @contact.name Risyandi API Maintainer
// @contact.url https://risyandi.com
// @contact.email hello@risyandi.com
// @license.name Apache 2.0
// @license.url https://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /api/v1
// @schemes http

func main() {
	/**
	*   1. Config environment
	*   2. Routes
	*   3. Middleware
	*   4. Validator
	**/

	// Initialize the validator
	validate = validator.New()

	// init config viper and setup router
	config := config.ConfigViper()
	router := routes.SetupRouter(validate)

	// server log
	if config.GetBool("server.log") {
		router.Use(middleware.RequestLoggerMiddleware())
	}

	// Start the server spesific port
	router.Run(config.GetString("server.port"))
}
