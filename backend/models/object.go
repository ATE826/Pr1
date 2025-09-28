package models

import (
	"gorm.io/gorm"
)

type Object struct {
	gorm.Model
	Title          string   `gorm:"not null" json:"title"`
	Description    string   `json:"description"`
	Location       string   `json:"location"`
	StartDate      string   `gorm:"not null" json:"start_date"`
	EndDate        string   `gorm:"not null" json:"end_date"`
	Status         string   `gorm:"not null;default:'active'" json:"status"`
	CountOfDefects int      `gorm:"not null;default:0" json:"count_of_defects"`
	Defects        []Defect `gorm:"foreignKey:ObjectID;constraint:OnDelete:CASCADE"`
	//Supervisor UserID uint     `gorm:"not null" json:"supervisor_user_id"`
}
