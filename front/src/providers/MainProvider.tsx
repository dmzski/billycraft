import { I18nProvider, useI18n } from "@/i18n";
import { sendErrorToSentry } from "@/utils/errors";
import { ToastProvider, useToast } from "@billycraft/ui";
import { DataLoaderProvider } from "@scaleway/use-dataloader";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "./UserProvider";
import { OrganizationProvider } from "./OrganizationProvider";

type MainProviderProps = {
	children: ReactNode;
};

const InternalDataLoaderProvider = ({ children }: MainProviderProps) => {
	const { t } = useI18n();
	const toast = useToast();

	return (
		<DataLoaderProvider
			onError={(err) => {
				sendErrorToSentry(err);
				toast.destructive(t("dataloaderError"));
			}}
		>
			<AuthProvider
				useAuthorizationHeader={window.location.hostname.includes("localhost")}
				onLogoutSuccess={() => {
					window.location.reload();
				}}
			>
				<UserProvider>
					<OrganizationProvider>{children}</OrganizationProvider>
				</UserProvider>
			</AuthProvider>
		</DataLoaderProvider>
	);
};

const MainProvider = ({ children }: MainProviderProps) => {
	return (
		<ThemeProvider storageKey="theme" defaultTheme="system">
			<ToastProvider>
				<I18nProvider locale="fr">
					<InternalDataLoaderProvider>{children}</InternalDataLoaderProvider>
				</I18nProvider>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default MainProvider;
