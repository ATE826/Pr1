package middleware

import (
	"net/http"
	"pr1/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		err := utils.ValidateToken(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "wrong token"})
			c.Abort()
			return
		}

		token, err := utils.GetToken(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token parsing error"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Dead token"})
			c.Abort()
			return
		}

		userId, ok := claims["id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "cannot get user id"})
			c.Abort()
			return
		}

		c.Set("user_id", uint(userId))
		c.Next()
	}

}
