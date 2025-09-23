package main

import (
	"log"
	"os"
	"pr1/handlers"
	"pr1/middleware"
	"pr1/models"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func SetupRouter(server *handlers.Server) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	api.POST("/register", server.Register)
	api.POST("/login", server.Login)
	api.GET("/:id", server.GetUser)

	// Пример защищённых маршрутов
	engineer := r.Group("/engineer")
	engineer.Use(middleware.JWTMiddleware())

	manager := r.Group("/manager")
	manager.Use(middleware.JWTMiddleware())

	supervisor := r.Group("/supervisor")
	supervisor.Use(middleware.JWTMiddleware())

	employer := r.Group("/employer")
	employer.Use(middleware.JWTMiddleware())

	return r
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loading .env file")
	}

	port := os.Getenv("PORT")

	db, err := models.Setup()
	if err != nil {
		log.Fatal(err)
	}

	server := handlers.NewServer(db)
	r := SetupRouter(server)

	log.Fatal(r.Run(":" + port))
}
