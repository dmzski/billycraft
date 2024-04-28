package requests

import "back/internal/lib/enums"

type InvitationFindAllParams struct {
	Status *enums.InvitationStatusEnum `query:"status"`
}
