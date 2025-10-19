package handlers

type RegisterInput struct {
	Role       string `json:"role" binding:"required,oneof=engineer manager visitor"`
	FirstName  string `json:"first_name" binding:"required"`
	LastName   string `json:"last_name" binding:"required"`
	Patronymic string `json:"patronymic"`
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

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
	ObjectID    uint   `json:"object_id"`
	EngineerID  uint   `json:"engineer_id"`
}

type DefectInputEditByEngineer struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Status      string `json:"status" binding:"required,oneof=active completed archived"`
}

type DefectInputEditByManager struct {
	Priority string `json:"priority" binding:"required,oneof=low medium high"`
	Deadline string `json:"deadline" binding:"required,datetime=2006-01-02"`
}
