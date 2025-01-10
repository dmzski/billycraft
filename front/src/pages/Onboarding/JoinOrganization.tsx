import { Alert, Loader, useToast } from "@billycraft/ui"
import { useI18n } from "@/i18n"
import { useForm } from "react-hook-form"
import { FormErrorAlert } from "@/components/FormErrorAlert"
import { useAllMyInvitationsQuery } from "@/queries/useAllMyInvitationsQuery"
import { sendErrorToSentry } from "@/utils/errors"
import { useUser } from "@/providers/UserProvider"
import { InvitationsService } from "@/sdk"
import { Form } from "@/components/form/Form"
import { Submit } from "@/components/form/Submit"
import { useOrganization } from "@/providers/OrganizationProvider"

export const JoinOrganization = () => {
	const { scopedT, t } = useI18n()
	const pageT = scopedT("onboarding.join")
	const { data, isLoading } = useAllMyInvitationsQuery()
	const { reload: reloadUser } = useUser()
	const { reload: reloadOrganization } = useOrganization()

	const toast = useToast()
	const methods = useForm()

	const onSubmit = async () => {
		try {
			if (data && data.length > 0) {
				await InvitationsService.postInvitationsAccept({
					body: {
						companyId: data[0].companyId,
					},
				})
				toast.show(pageT("success"))
				await Promise.all([reloadUser(), reloadOrganization()])
			}
		} catch (err) {
			sendErrorToSentry(err)
			methods.setError("root", { message: t("genericFormError") })
		}
	}

	if (isLoading && !data) {
		return (
			<div className="flex justify-center items-center">
				<Loader />
			</div>
		)
	}

	if (!data) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>
	}

	return data.length === 0 ? (
		<div className="flex flex-col gap-4 items-center">
			<h2 className="text-3xl font-bold text-center">
				{t("onboarding.join.title")}
			</h2>
			<p>{pageT("description")}</p>
		</div>
	) : (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-4 items-center">
				<h2 className="text-3xl font-bold text-center">
					{t("onboarding.join.title")}
				</h2>
				<p>
					{pageT("youAreInvited", {
						companyName: data[0].companyName,
						roleName: t(`roles.${data[0].role}`),
					})}
				</p>
				<FormErrorAlert />
				<Submit>{pageT("submit")}</Submit>
			</div>
		</Form>
	)
}
