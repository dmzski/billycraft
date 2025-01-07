import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
} from "react";
import * as Sentry from "@sentry/react";
import { useAuth } from "./AuthProvider";
import { useMyInformationQuery } from "@/queries/useMyInformationQuery";
import type { UserResponse } from "@/sdk";

type UserContextType = {
	user?: UserResponse;
	reload: () => Promise<void>;
};
const UserContext = createContext<UserContextType>({
	reload: () => Promise.resolve(),
});

type UserProviderProps = {
	children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
	const { isAuthenticated } = useAuth();
	const { data: user, reload } = useMyInformationQuery({
		enabled: isAuthenticated,
	});

	const value = useMemo(() => ({ user, reload }), [user, reload]);

	useEffect(() => {
		if (user) {
			Sentry.setUser({ email: user.email });
			Sentry.setExtra("companyId", user.companyId);
		}
	}, [user]);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used inside UserProvider");
	}
	return context;
};
