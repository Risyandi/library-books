package routes

import (
	"library-books/controllers/users"

	"github.com/gin-gonic/gin"
)

func UsersRoutes(route *gin.RouterGroup, usersController *users.UsersController) {
	route.GET("/profile", usersController.ProfileHandler)
}
