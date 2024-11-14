import { API_URL } from "@/constants/global";
import { ApiError } from "@/lib/ApiError";
import { client } from "@/sdk/services.gen";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type UpdateUserParams = {
	name?: string;
	oldPassword?: string;
	password?: string;
};

type AuthContextType = {
	login: (params: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (params: UpdateUserParams) => Promise<void>;
	register: (params: {
		email: string;
		password: string;
		name: string;
	}) => Promise<void>;
	refreshSession: () => Promise<void>;
	isAuthenticated: boolean;
	isInitializing: boolean;
};

type AuthProviderProps = {
	children: ReactNode;
	onLoginSuccess?: () => Promise<void> | void;
	onLogoutSuccess?: () => Promise<void> | void;
	onRefreshSuccess?: () => Promise<void> | void;
	onRegisterSuccess?: () => Promise<void> | void;
	useAuthorizationHeader?: boolean;
};

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isInitializing: true,
	login: () => Promise.resolve(),
	logout: () => Promise.resolve(),
	register: () => Promise.resolve(),
	updateUser: () => Promise.resolve(),
	refreshSession: () => Promise.resolve(),
});

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? "";
const LOCAL_STORAGE_KEY = "coco_at";

const configureClient = (token: string, needAuthorizationHeader?: boolean) => {
	client.setConfig({
		baseUrl: API_URL,
		credentials: "include",
		throwOnError: true,
		headers: needAuthorizationHeader
			? {
					Authorization: `Bearer ${token}`,
				}
			: undefined,
	});
};

export const AuthProvider = ({
	children,
	onLoginSuccess,
	onLogoutSuccess,
	onRefreshSuccess,
	onRegisterSuccess,
	useAuthorizationHeader,
}: AuthProviderProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
		undefined,
	);

	const login: AuthContextType["login"] = useCallback(
		async ({ email, password }) => {
			const res = await fetch(`${AUTH_API_URL}/auth/login`, {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					email,
					password,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				const { token } = await res.json();
				if (useAuthorizationHeader) {
					localStorage.setItem(LOCAL_STORAGE_KEY, token);
				}
				configureClient(token, useAuthorizationHeader);
				setIsAuthenticated(true);
				await onLoginSuccess?.();
			} else {
				const { message } = await res.json();
				throw new ApiError(res.status, message);
			}
		},
		[onLoginSuccess, useAuthorizationHeader],
	);

	const register: AuthContextType["register"] = useCallback(
		async ({ email, password, name }) => {
			const res = await fetch(`${AUTH_API_URL}/auth/register`, {
				method: "POST",
				body: JSON.stringify({
					email,
					password,
					name,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				await onRegisterSuccess?.();
			} else {
				const { message } = await res.json();
				throw new ApiError(res.status, message);
			}
		},
		[onRegisterSuccess],
	);

	const logout = useCallback(async () => {
		if (useAuthorizationHeader) {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			await onLogoutSuccess?.();

			return;
		}
		const res = await fetch(`${AUTH_API_URL}/auth/logout`, {
			method: "GET",
			credentials: "include",
		});
		if (res.ok) {
			await onLogoutSuccess?.();
		} else {
			const { message } = await res.json();
			throw new ApiError(res.status, message);
		}
		setIsAuthenticated(false);
	}, [onLogoutSuccess, useAuthorizationHeader]);

	const refreshSession = useCallback(async () => {
		try {
			if (useAuthorizationHeader && localStorage.getItem(LOCAL_STORAGE_KEY)) {
				const res = await fetch(`${AUTH_API_URL}/auth/refresh`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY)}`,
					},
				});
				if (res.ok) {
					const { token } = await res.json();
					configureClient(token, useAuthorizationHeader);
					localStorage.setItem(LOCAL_STORAGE_KEY, token);
					if (!isAuthenticated) {
						setIsAuthenticated(true);
					}
					await onRefreshSuccess?.();
				} else {
					if (isAuthenticated || isAuthenticated === undefined) {
						setIsAuthenticated(false);
					}
					const { message } = await res.json();
					throw new ApiError(res.status, message);
				}
			} else {
				const res = await fetch(`${AUTH_API_URL}/auth/refresh`, {
					credentials: "include",
				});
				if (res.ok) {
					if (!isAuthenticated) {
						setIsAuthenticated(true);
					}
					await onRefreshSuccess?.();
				} else {
					if (isAuthenticated || isAuthenticated === undefined) {
						setIsAuthenticated(false);
					}
					const { message } = await res.json();
					throw new ApiError(res.status, message);
				}
			}
		} catch (err) {
			if (isAuthenticated || isAuthenticated === undefined) {
				setIsAuthenticated(false);
			}
			throw err;
		}
	}, [useAuthorizationHeader, onRefreshSuccess, isAuthenticated]);

	const updateUser = useCallback(
		async ({ name, password, oldPassword }: UpdateUserParams) => {
			if (useAuthorizationHeader && localStorage.getItem(LOCAL_STORAGE_KEY)) {
				const res = await fetch(`${AUTH_API_URL}/auth/update`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY)}`,
            "Content-Type": "application/json",
					},
					method: "PATCH",
					body: JSON.stringify({
						name,
						password,
						oldPassword,
					}),
				});
				if (!res.ok) {
					const { message } = await res.json();
					throw new ApiError(res.status, message);
				}
			} else {
				const res = await fetch(`${AUTH_API_URL}/auth/refresh`, {
					credentials: "include",
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						password,
						oldPassword,
					}),
				});
				if (!res.ok) {
					const { message } = await res.json();
					throw new ApiError(res.status, message);
				}
			}
		},
		[useAuthorizationHeader],
	);

	useEffect(() => {
		if (!isAuthenticated) {
			refreshSession().catch(() => null);
		}
	}, [refreshSession, isAuthenticated]);

	const value = useMemo(
		() =>
			({
				isInitializing: isAuthenticated === undefined,
				isAuthenticated: !!isAuthenticated,
				refreshSession,
				updateUser,
				register,
				logout,
				login,
			}) as AuthContextType,
		[isAuthenticated, refreshSession, register, logout, login, updateUser],
	);

	if (!AUTH_API_URL || AUTH_API_URL.endsWith("/")) {
		throw new Error("VITE_AUTH_API_URL need to be set with no trailing slash");
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used inside AuthContext");
	}

	return context;
};
