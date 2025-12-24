package role

import (
	"back/database"
	"back/internal/lib/models"
	"back/internal/lib/requests"
)

type RoleDao struct {
}

func (dao RoleDao) FindAllByOrganization(organizationId string) (roles []models.Role) {
	database.DBConn.Find(&roles, "company_id = ?", organizationId).Order("created_at desc")
	return
}
func (dao RoleDao) FindOneByOrganizationAndUser(organizationId string, email string) (role models.Role) {
	if err := database.DBConn.First(&role, "company_id = ? AND email = ?", organizationId, email); err != nil {
		panic(err)
	}
	return
}
func (dao RoleDao) FindOneByOrganizationAndUserNotAccepted(organizationId string, email string) (role models.Role) {
	if err := database.DBConn.First(&role, "company_id = ? AND email = ? AND accepted = FALSE", organizationId, email).Error; err != nil {
		panic(err)
	}
	return
}

func (dao RoleDao) Create(organizationId string, dto requests.RoleRequest) (newRole models.Role, err error) {
	tx := database.DBConn.Begin()
	newRole = models.Role{
		Role:      dto.Role,
		Email:     dto.Email,
		CompanyID: organizationId,
	}

	tx.Create(&newRole)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

func (dao RoleDao) Update(organizationId string, dto requests.RoleRequest) (newRole models.Role, err error) {
	tx := database.DBConn.Begin()
	newRole = models.Role{
		CompanyID: organizationId,
		Email:     dto.Email,
		Role:      dto.Role,
	}

	tx.Model(&newRole).Updates(&newRole)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

func (dao RoleDao) Delete(userId string, organizationId string) {
	tx := database.DBConn.Begin()
	tx.Delete(&models.Role{}, "user_id = ? AND company_id = ?", userId, organizationId)
	if tx.Error != nil {
		err := tx.Error
		tx.Rollback()
		panic(err)
	}
	tx.Commit()
}

var (
	DAO = &RoleDao{}
)
