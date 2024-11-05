import { RoleName } from "./Role";

export type InvitationStatus = "ACCEPTED" | "PENDING" | "REFUSED";

export type InvitationResponse = {
	email: string;
	createdAt: string;
	status: InvitationStatus;
	role: RoleName;
};

export type MyInvitationResponse = {
	companyId: string;
	companyName: string;
	createdAt: string;
	status: InvitationStatus;
	role: RoleName;
};

export type InvitationRequest = {
	email: string;
	role: RoleName;
};

export type AcceptInvitationRequest = {
	companyId: string;
};

export type RefuseInvitationRequest = {
	companyId: string;
};

export type DeleteInvitationRequest = {
	email: string;
};

export type InvitationFindAllParams = {
	status?: InvitationStatus;
};
