package middleware

import (
	"library-books/config"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// configuration key secret jwt
		config := config.ConfigViper()
		jwtKeySecret := config.GetString("jwt.key")

		tokenString := ctx.GetHeader("Authorization")
		jwtString := strings.Split(tokenString, "Bearer ")[1]

		if tokenString == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			ctx.Abort()
			return
		}

		token, err := jwt.Parse(jwtString, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKeySecret), nil
		})

		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired JWT"})
			ctx.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		ctx.Set("claims", claims)
		ctx.Next()
	}
}
