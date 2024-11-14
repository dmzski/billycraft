import { I18nProvider } from "@/i18n";
import { sendErrorToSentry } from "@/utils/errors";
import { ToastProvider } from "@billycraft/ui";
import { DataLoaderProvider } from "@scaleway/use-dataloader";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "./UserProvider";

type MainProviderProps = {
	children: ReactNode;
};
const MainProvider = ({ children }: MainProviderProps) => {
	return (
		<ThemeProvider storageKey="cocoerp-theme" defaultTheme="system">
			<I18nProvider locale="fr">
				<DataLoaderProvider
					onError={(err) => {
						sendErrorToSentry(err);
					}}
				>
					<AuthProvider
						useAuthorizationHeader={window.location.hostname.includes(
							"localhost",
						)}
						onLogoutSuccess={() => {
							window.location.reload();
						}}
					>
						<ToastProvider>
							<UserProvider>{children}</UserProvider>
						</ToastProvider>
					</AuthProvider>
				</DataLoaderProvider>
			</I18nProvider>
		</ThemeProvider>
	);
};

export default MainProvider;
