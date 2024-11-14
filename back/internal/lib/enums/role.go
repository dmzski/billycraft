package enums

import "slices"

type RoleEnum string //@name RoleEnum

const (
	RoleEnumOwner   RoleEnum = "OWNER"
	RoleEnumAdmin   RoleEnum = "ADMIN"
	RoleEnumEditor  RoleEnum = "EDITOR"
	RoleEnumViewer  RoleEnum = "VIEWER"
	RoleEnumBilling RoleEnum = "BILLING"
)

func CheckRoleEqualsOrGreaterThan(userRole RoleEnum, wantedRole RoleEnum) bool {
	if userRole == RoleEnumOwner {
		return true
	}
	if wantedRole == RoleEnumAdmin {
		roles := []RoleEnum{RoleEnumAdmin}
		return slices.Contains(roles, userRole)
	}
	if wantedRole == RoleEnumEditor {
		roles := []RoleEnum{RoleEnumAdmin, RoleEnumEditor}
		return slices.Contains(roles, userRole)
	}
	if wantedRole == RoleEnumViewer {
		roles := []RoleEnum{RoleEnumAdmin, RoleEnumEditor, RoleEnumViewer}
		return slices.Contains(roles, userRole)
	}
	if wantedRole == RoleEnumBilling {
		roles := []RoleEnum{RoleEnumAdmin, RoleEnumBilling}
		return slices.Contains(roles, userRole)
	}

	return false
}
