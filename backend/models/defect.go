package models

import "gorm.io/gorm"

type Defect struct {
	gorm.Model
	Title       string       `gorm:"not null" json:"title"`
	Description string       `json:"description"`
	Priority    string       `gorm:"not null" json:"priority"`
	EngineerID  uint         `gorm:"not null" json:"engineer_id"`
	Deadline    string       `json:"deadline"`
	Attachments []Attachment `gorm:"foreignKey:DefectID"` // <- связь один-ко-многим
	Status      string       `gorm:"not null;default:'new'" json:"status"`
}

type Attachment struct {
	gorm.Model
	DefectID   uint   `gorm:"not null;index"`
	FileName   string `gorm:"not null"`
	FilePath   string `gorm:"not null"`
	MimeType   string
	UploadedBy uint
}
