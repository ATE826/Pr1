package models

import (
	"fmt"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Setup() (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var db *gorm.DB
	var err error

	// Ждём до 30 секунд, пока база не станет доступна
	for i := 0; i < 15; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		fmt.Println("Waiting for database... attempt", i+1)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Автоматическая миграция
	if err := db.AutoMigrate(&User{}, &Defect{}); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	fmt.Println("Database connected")
	return db, nil
}
