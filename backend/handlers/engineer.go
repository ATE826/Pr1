package handlers

import (
	"net/http"
	"pr1/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ========== Дефекты ==========

func (s *Server) CreateDefect(c *gin.Context) {
	// Получаем ID объекта из URL
	objectIDParam := c.Param("object_id")
	objectID, err := strconv.ParseUint(objectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}

	// Проверяем, существует ли объект
	var object models.Object
	if err := s.db.First(&object, objectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "object not found"})
		return
	}

	// Привязываем JSON
	var input DefectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем ID инженера из токена
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found"})
		return
	}

	// Создаём дефект, связанный с объектом
	defect := models.Defect{
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
		Priority:    input.Priority,
		Deadline:    input.Deadline,
		ObjectID:    uint(objectID),
		EngineerID:  userID.(uint),
	}

	if err := s.db.Create(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Увеличиваем счётчик дефектов у объекта
	if err := s.db.Model(&object).Update("count_of_defects", gorm.Expr("count_of_defects + ?", 1)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update object defect count"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":       "Defect successfully created and linked to object",
		"defect_id":     defect.ID,
		"object_id":     defect.ObjectID,
		"created_by":    userID,
		"total_defects": object.CountOfDefects + 1,
	})
}

func (s *Server) EditDefectByEngineer(c *gin.Context) {
	objectIDParam := c.Param("object_id")
	defectIDParam := c.Param("defect_id")

	// Парсим параметры
	objectID, err := strconv.ParseUint(objectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid object ID"})
		return
	}
	defectID, err := strconv.ParseUint(defectIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid defect ID"})
		return
	}

	// Проверяем, существует ли объект
	var object models.Object
	if err := s.db.First(&object, objectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "object not found"})
		return
	}

	// Получаем дефект
	var defect models.Defect
	if err := s.db.First(&defect, defectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "defect not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch defect"})
		return
	}

	// Проверяем принадлежность дефекта объекту
	if defect.ObjectID != uint(objectID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "this defect does not belong to the specified object"})
		return
	}

	// Привязываем JSON
	var input DefectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Обновляем только разрешённые поля
	if input.Title != "" {
		defect.Title = input.Title
	}
	if input.Description != "" {
		defect.Description = input.Description
	}
	if input.Status != "" {
		defect.Status = input.Status
	}

	// Сохраняем изменения
	if err := s.db.Save(&defect).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update defect"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Defect has been updated",
		"defect_id": defect.ID,
		"object_id": defect.ObjectID,
	})
}
