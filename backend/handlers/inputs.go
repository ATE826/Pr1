package handlers

type ObjectInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Location    string `json:"location"`
	StartDate   string `json:"start_date" binding:"required,datetime=2006-01-02"`
	EndDate     string `json:"end_date" binding:"required,datetime=2006-01-02"`
	Status      string `json:"status" binding:"required,oneof=active completed archived"`
}

type DefectInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Status      string `json:"status" binding:"required,oneof=new in_progress checking canceled completed"`
	Priority    string `json:"priority" binding:"required,oneof=low medium high"`
	Deadline    string `json:"deadline" binding:"required,datetime=2006-01-02"`
	ObjectID    uint   `json:"object_id" binding:"required"`
	EngineerID  uint   `json:"engineer_id" binding:"required"`
}
