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

	// Публичные маршруты
	api := r.Group("/api")
	api.POST("/register", server.Register)
	api.POST("/login", server.Login)

	// ============ Инженер ============
	engineer := r.Group("/engineer")
	engineer.Use(
		middleware.JWTMiddleware(),
		middleware.RoleMiddleware("engineer"),
	)
	engineer.GET("/profile", server.GetCurrentUser)

	// Дефекты
	engineer.POST("/defect", server.CreateDefect)
	engineer.GET("/defects", server.GetAllDefects)
	engineer.GET("/defect/:id", server.GetDefectByID)
	engineer.PUT("/defect/:id", server.EditDefect)
	engineer.DELETE("/defect/:id", server.DeleteDefect)

	// ============ Менеджер ============
	manager := r.Group("/manager")
	manager.Use(
		middleware.JWTMiddleware(),
		middleware.RoleMiddleware("manager"),
	)
	manager.GET("/profile", server.GetCurrentUser)

	// ============ Руководитель и заказчик ============
	visitor := r.Group("/visitor")
	visitor.Use(
		middleware.JWTMiddleware(),
		middleware.RoleMiddleware("visitor"),
	)
	visitor.GET("/profile", server.GetCurrentUser)

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
