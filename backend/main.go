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

	// CSRF middleware
	// r.Use(csrf.Middleware(csrf.Options{
	// 	Secret: os.Getenv("CSRF_SECRET"), // добавить в .env
	// 	ErrorFunc: func(c *gin.Context) {
	// 		c.JSON(400, gin.H{"error": "CSRF token mismatch"})
	// 		c.Abort()
	// 	},
	// }))

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
	//engineer.GET("/profile", server.GetCurrentUser)

	// Объекты
	engineer.GET("/objects", server.GetAllObjects)
	engineer.GET("/object/:object_id", server.GetObjectByID)

	// Дефекты конкретного объекта
	engineer.POST("/object/:object_id/defect", server.CreateDefect)
	engineer.GET("/object/:object_id/defects", server.GetAllDefects)
	engineer.GET("/object/:object_id/defect/:defect_id", server.GetDefectByID)
	engineer.PATCH("/object/:object_id/defect/:defect_id", server.EditDefectByEngineer) // Изменение статуса, описания, названия
	// engineer.PATCH("/object/:object_id/defect/:defect_id", server.EditDefect)

	// ============ Менеджер ============

	manager := r.Group("/manager")
	manager.Use(
		middleware.JWTMiddleware(),
		middleware.RoleMiddleware("manager"),
	)
	//manager.GET("/profile", server.GetCurrentUser)

	// Объекты
	manager.POST("/object", server.CreateObject)
	manager.GET("/objects", server.GetAllObjects)
	manager.GET("/object/:object_id", server.GetObjectByID)
	manager.PATCH("/object/:object_id", server.EditObject)
	manager.DELETE("/object/:object_id", server.DeleteObject)

	// Дефекты
	manager.GET("/object/:object_id/defects", server.GetAllDefects)
	manager.GET("/object/:object_id/defect/:defect_id", server.GetDefectByID)
	manager.PATCH("/object/:object_id/defect/:defect_id", server.EditDefectByManager) // Изменение приоритетности и дедлайна
	// manager.PATCH("/object/:object_id/defect/:defect_id", server.EditDefect)
	manager.DELETE("/object/:object_id/defect/:defect_id", server.DeleteDefect)

	// ============ Заказчик ============
	visitor := r.Group("/visitor")
	visitor.Use(
		middleware.JWTMiddleware(),
		middleware.RoleMiddleware("visitor"),
	)
	//visitor.GET("/profile", server.GetCurrentUser)

	// Объекты
	visitor.GET("/objects", server.GetAllObjects)
	visitor.GET("/object/:object_id", server.GetObjectByID)

	// Дефекты
	visitor.GET("/object/:object_id/defects", server.GetAllDefects)
	visitor.GET("/object/:object_id/defect/:defect_id", server.GetDefectByID)

	// ============ Руководитель ============
	leader := r.Group("/leader")
	leader.Use(
		middleware.JWTMiddleware(),
		middleware.RoleMiddleware("leader"),
	)
	//leader.GET("/profile", server.GetCurrentUser)

	// Объекты
	leader.GET("/objects", server.GetAllObjects)
	leader.GET("/object/:object_id", server.GetObjectByID)

	// Дефекты
	leader.GET("/object/:object_id/defects", server.GetAllDefects)
	leader.GET("/object/:object_id/defect/:defect_id", server.GetDefectByID)

	// ============ Профиль ============

	profile := r.Group("/profile")
	profile.Use(middleware.JWTMiddleware()) // только проверка токена
	profile.GET("", server.GetCurrentUser)
	profile.PATCH("/edit", server.EditCurrentUser)

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
