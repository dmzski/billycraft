package invitations

import (
	"back/database"
	"back/internal/lib/dtos"
	"back/internal/lib/enums"
	"back/internal/lib/models"
	"back/internal/lib/requests"
	"log"

	"gorm.io/gorm"
)

type InvitationDao struct {
}

func (dao InvitationDao) FindAllByOrganization(organizationId string, params requests.InvitationFindAllParams) (invitations []models.Invitation) {
	log.Println(params.Status)
	conn := database.DBConn
	conn.Scopes(func(db *gorm.DB) *gorm.DB {
		if params.Status != nil {
			db.Where("status = ?", params.Status)
		}
		db.Where("company_id = ?", organizationId)

		return db

	}).Find(&invitations).Order("created_at desc")
	return
}

func (dao InvitationDao) FindAllByOrganizationAndStatus(organizationId string, status enums.InvitationStatusEnum) (invitations []models.Invitation) {
	database.DBConn.Find(&invitations, "company_id = ? AND status = ?", organizationId, status).Order("created_at desc")
	return
}
func (dao InvitationDao) FindOneByOrganizationAndUser(organizationId string, email string) (invitation models.Invitation) {
	if err := database.DBConn.First(&invitation, "company_id = ? AND email = ?", organizationId, email); err != nil {
		panic(err)
	}
	return
}
func (dao InvitationDao) FindOneByOrganizationAndUserAcceptedIsPeding(organizationId string, email string) (invitation models.Invitation) {
	if err := database.DBConn.First(&invitation, "company_id = ? AND email = ? AND accepted = 'PENDING'", organizationId, email).Error; err != nil {
		panic(err)
	}
	return
}
func (dao InvitationDao) FindAllMyInvitationsPending(email string) (invitations []dtos.MyInvitationResponse) {
	invitations = make([]dtos.MyInvitationResponse, 0)
	if err := database.DBConn.Raw(`
  SELECT
    i.company_id as company_id,
    c.name as company_name,
    i.created_at as created_at,
    i.status as status,
    i.role as role
  FROM com_invitation i JOIN com_company c ON i.company_id = c.id
  WHERE i.email = ? AND i.status = 'PENDING';
  `, email).Scan(&invitations).Error; err != nil {
		panic(err)
	}

	return
}

func (dao InvitationDao) Create(organizationId string, dto dtos.InvitationRequest) (invitation models.Invitation, err error) {
	tx := database.DBConn.Begin()
	invitation = models.Invitation{}
	invitation.FromDTO(dto)
	invitation.CompanyID = organizationId

	tx.Create(&invitation)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

func (dao InvitationDao) Accept(organizationId string, email string) (invitation models.Invitation, err error) {
	tx := database.DBConn.Begin()
	tx.First(&invitation, "company_id = ? AND email = ?", organizationId, email)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}

	invitation.Status = enums.InvitationStatusAccepted
	tx.Model(&invitation).Updates(&invitation)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Model(&models.Role{}).Create(&models.Role{
		Role:      invitation.Role,
		Email:     email,
		CompanyID: organizationId,
	})
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Model(&models.User{}).Where("email = ?", email).UpdateColumn("company_id", organizationId)

	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

func (dao InvitationDao) Refused(organizationId string, email string) (invitation models.Invitation, err error) {
	tx := database.DBConn.Begin()
	invitation = models.Invitation{
		Email:     email,
		CompanyID: organizationId,
		Status:    enums.InvitationStatusRefused,
	}

	tx.Updates(&invitation)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return
	}
	tx.Commit()
	return
}

func (dao InvitationDao) Delete(userId string, organizationId string) (err error) {
	tx := database.DBConn.Begin()
	tx.Delete(&models.Invitation{}, "email = ? AND company_id = ?", userId, organizationId)
	if tx.Error != nil {
		err = tx.Error
		tx.Rollback()
		return err
	}
	tx.Commit()
	return
}

var (
	DAO = &InvitationDao{}
)
