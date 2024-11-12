import { Alert, Button, Loader, useToast } from "@billycraft/ui";
import { useI18n } from "@/i18n";
import { FormProvider, useForm } from "react-hook-form";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { useAllMyInvitationsQuery } from "@/queries/useAllMyInvitationsQuery";
import { sendErrorToSentry } from "@/utils/errors";
import { InvitationApi } from "@/api/InvitationApi";
import { useUser } from "@/providers/UserProvider";

export const JoinOrganization = () => {
	const { scopedT, t } = useI18n();
	const pageT = scopedT("onboarding.join");
	const { data, isLoading } = useAllMyInvitationsQuery();
	const { reload } = useUser();

	const toast = useToast();
	const methods = useForm();

	const onSubmit = async () => {
		try {
			if (data && data.length > 0) {
				await InvitationApi.accept({
					companyId: data[0].companyId,
				});
				toast.show(pageT("success"));
				await reload();
			}
		} catch (err) {
			sendErrorToSentry(err);
			methods.setError("root", { message: t("genericFormError") });
		}
	};

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	if (isLoading && !data) {
		return (
			<div className="flex justify-center items-center">
				<Loader />
			</div>
		);
	}

	if (!data) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return data.length === 0 ? (
		<div className="flex flex-col gap-4 items-center">
			<h2 className="text-3xl font-bold text-center">
				{t("onboarding.join.title")}
			</h2>
			<p>{pageT("description")}</p>
		</div>
	) : (
		<FormProvider {...methods}>
			<form
				className="flex flex-col gap-4 items-center"
				onSubmit={handleSubmit(onSubmit)}
			>
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
				<Button type="submit" disabled={isSubmitting}>
					{pageT("submit")}
				</Button>
			</form>
		</FormProvider>
	);
};
