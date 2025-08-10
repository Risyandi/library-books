package routes

import (
	"library-books/controllers/books"

	"github.com/gin-gonic/gin"
)

func BooksRoutes(route *gin.RouterGroup, booksController *books.BooksController) {
	route.POST("/", booksController.AddBookHandler)
	route.GET("/", booksController.GetAllBookHandler)
	route.GET("/:id", booksController.GetBookHandler)
	route.PUT("/:id", booksController.UpdateBookHandler)
	route.DELETE("/:id", booksController.DeleteBookHandler)
}
