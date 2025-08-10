package routes

import (
	"library-books/controllers/users"

	"github.com/gin-gonic/gin"
)

func AuthUsersRoutes(route *gin.RouterGroup, usersController *users.UsersController) {
	route.POST("/register", usersController.RegisterHandler)
	route.POST("/login", usersController.LoginHandler)
}
