import type { BillStatus, QuoteStatus } from "./sdk";

export type QuoteRouteProps = {
	id: string;
};
export type QuoteRouteQueryParams = {
	tab?: QuoteStatus | "all";
};

export type QuoteOverviewRouteQueryParams = {
	fromTab?: QuoteRouteQueryParams["tab"];
};

export type BillRouteProps = {
	id: string;
};

export type BillRouteQueryParams = {
	tab?: BillStatus | "all";
};

export type BillOverviewRouteQueryParams = {
	fromTab?: BillRouteQueryParams["tab"];
};

export type CustomerRouteProps = {
	id: string;
};

export type SupplierRouteProps = {
	id: string;
};

export type OutgoingRouteProps = {
	id: string;
};

export type ReportRouteProps = {
	id: string;
};

const DEFAULT_QUOTE_ROUTE_PARAMS: QuoteRouteProps = { id: ":id" };
const DEFAULT_BILL_ROUTE_PARAMS: BillRouteProps = { id: ":id" };
const DEFAULT_CUSTOMER_ROUTE_PARAMS: CustomerRouteProps = { id: ":id" };
const DEFAULT_SUPPLIER_ROUTE_PARAMS: SupplierRouteProps = { id: ":id" };
const DEFAULT_OUTGOING_ROUTE_PARAMS: OutgoingRouteProps = { id: ":id" };
const DEFAULT_REPORT_ROUTE_PARAMS: ReportRouteProps = { id: ":id" };

export const ROUTES = {
	LOGIN: {
		id: "login",
		path: () => "/login",
		route: "/login",
	},
	REGISTER: {
		id: "register",
		path: () => "/register",
		route: "/register",
	},
	BILLS: {
		id: "bills",
		route: "/bills/*",
		path: (query?: BillRouteQueryParams) =>
			`/bills${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
		routes: {
			INDEX: {
				id: "bills",
				exact: true,
				path: (query?: BillRouteQueryParams) =>
					`/bills${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
				route: "/",
			},
			FORM: {
				id: "bills.form",
				path: (params: BillRouteProps) => `/bills/edit/${params.id}`,
				route: `/edit/${DEFAULT_BILL_ROUTE_PARAMS.id}`,
			},
			ADD: {
				id: "bills.form",
				path: () => "/bills/create",
				route: "/create",
			},
			EDIT: {
				id: "bills.form",
				path: (params: BillRouteProps) => `/bills/edit/${params.id}`,
				route: `/edit/${DEFAULT_BILL_ROUTE_PARAMS.id}`,
			},
			OVERVIEW: {
				id: "bills.form",
				path: (params: BillRouteProps, query?: BillOverviewRouteQueryParams) =>
					`/bills/overview/${params.id}${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
				route: `/overview/${DEFAULT_BILL_ROUTE_PARAMS.id}`,
			},
		},
	},
	CUSTOMERS: {
		id: "customers",
		route: "/customers/*",
		path: () => "/customers",
		routes: {
			INDEX: {
				id: "customers",
				path: () => "/customers",
				route: "/",
			},
			ADD: {
				id: "customers.add",
				path: () => "/customers/create",
				route: "/create",
			},
			EDIT: {
				id: "customers.edit",
				path: (params: CustomerRouteProps) => `/customers/edit/${params.id}`,
				route: `/edit/${DEFAULT_CUSTOMER_ROUTE_PARAMS.id}`,
			},
			OVERVIEW: {
				id: "customers.overview",
				path: (params: CustomerRouteProps) =>
					`/customers/overview/${params.id}`,
				route: `/overview/${DEFAULT_CUSTOMER_ROUTE_PARAMS.id}`,
			},
		},
	},
	DASHBOARD: {
		id: "dashboard",
		path: () => "/dashboard",
		route: "/dashboard",
	},
	HISTORY: {
		id: "history",
		path: () => "/history",
		route: "/history/*",
		routes: {
			TODOS: {
				id: "history.todos",
				path: () => "/history/todos",
				route: "/todos",
			},
		},
	},
	ONBOARDING: {
		id: "onboarding",
		path: () => "/onboarding",
		route: "/onboarding/*",
		routes: {
			INDEX: {
				id: "onboarding",
				path: () => "/onboarding",
				route: "/",
			},
			CREATE: {
				id: "onboarding.create",
				path: () => "/onboarding/create-organization",
				route: "/create-organization",
			},
			JOIN: {
				id: "onboarding.join",
				path: () => "/onboarding/join-organization",
				route: "/join-organization",
			},
		},
	},
	PRODUCTS: {
		id: "products",
		path: () => "/products",
		route: "/products/*",
		routes: {
			LIST: {
				path: () => "/products/list",
				route: "/list",
				id: "products.list",
			},
			GROUPS: {
				path: () => "/products/groups",
				route: "/groups",
				id: "products.groups",
			},
		},
	},
	QUOTES: {
		id: "quotes",
		path: () => "/quotes",
		route: "/quotes/*",
		routes: {
			INDEX: {
				id: "quotes",
				path: (query?: QuoteRouteQueryParams) =>
					`/quotes${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
				route: "/",
			},
			OVERVIEW: {
				id: "quotes.overview",
				path: (
					params: QuoteRouteProps,
					query?: QuoteOverviewRouteQueryParams,
				) =>
					`/quotes/overview/${params.id}${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
				route: `/overview/${DEFAULT_QUOTE_ROUTE_PARAMS.id}`,
			},
			EDIT: {
				id: "quotes.edit",
				path: (params: QuoteRouteProps) => `/quotes/edit/${params.id}`,
				route: `/edit/${DEFAULT_QUOTE_ROUTE_PARAMS.id}`,
			},
			ADD: {
				id: "quotes.add",
				path: () => "/quotes/create",
				route: "/create",
			},
		},
	},
	ACCOUNT: {
		id: "account",
		path: () => "/account",
		route: "/account",
	},
	ORGANIZATION: {
		id: "organization",
		path: () => "/organization/",
		route: "/organization/*",
		routes: {
			SETTINGS: {
				id: "organization.settings",
				path: () => "/organization/settings",
				route: "/settings",
			},
			USERS: {
				id: "organization.users",
				path: () => "/organization/users",
				route: "/users/*",
				routes: {
					USERS: {
						id: "organization.users.users",
						path: () => "/organization/users/users",
						route: "/users",
					},
					INVITATIONS: {
						id: "organization.users.invitations",
						path: () => "/organization/users/invitations",
						route: "/invitations",
					},
				},
			},
			CUSTOMIZATION: {
				id: "organization.customization",
				path: () => "/organization/customization",
				route: "/customization/*",
				routes: {
					BILL: {
						id: "organization.customization.bill",
						path: () => "/organization/customization/bill",
						route: "/bill",
					},
					QUOTE: {
						id: "organization.customization.quote",
						path: () => "/organization/customization/quote",
						route: "/quote",
					},
				},
			},
		},
	},
	SUPPLIERS: {
		id: "suppliers",
		path: () => "/suppliers",
		route: "/suppliers/*",
		routes: {
			INDEX: {
				id: "suppliers",
				path: () => "/suppliers",
				route: "/",
			},
			FORM: {
				id: "suppliers.form",
				path: (params: SupplierRouteProps) => `/suppliers/${params.id}`,
				route: `/${DEFAULT_SUPPLIER_ROUTE_PARAMS.id}`,
			},
		},
	},
	ACCOUNTINGS: {
		id: "accounting",
		path: () => "/accounting",
		route: "/accounting/*",
		routes: {
			OUTGOINGS: {
				id: "accounting.outgoings",
				path: () => "/accounting/outgoings",
				route: "/outgoings/*",
				routes: {
					OVERVIEW: {
						id: "accounting.outgoings.overview",
						path: () => "/accounting/outgoings/overview",
						route: "/overview",
					},
					LIST: {
						id: "accounting.outgoings.list",
						path: () => "/accounting/outgoings/list",
						route: "/list",
					},
					FORM: {
						id: "accounting.outgoings.form",
						path: (params: OutgoingRouteProps) =>
							`/accounting/outgoings/edit/${params.id}`,
						route: `/edit/${DEFAULT_OUTGOING_ROUTE_PARAMS.id}`,
					},
					DETAILS: {
						id: "accounting.outgoings.details",
						path: (params: OutgoingRouteProps) =>
							`/accounting/outgoings/details/${params.id}`,
						route: `/details/${DEFAULT_OUTGOING_ROUTE_PARAMS.id}`,
					},
				},
			},
			REPORTS: {
				id: "accounting.reports",
				path: () => "/accounting/reports",
				route: "/reports/*",
				routes: {
					OVERVIEW: {
						id: "accounting.reports.overview",
						path: () => "/accounting/reports/overview",
						route: "/overview",
					},
					DETAILS: {
						id: "accounting.reports.details",
						path: (params: ReportRouteProps) =>
							`/accounting/reports/details/${params.id}`,
						route: `/details/${DEFAULT_REPORT_ROUTE_PARAMS.id}`,
					},
					LIST: {
						id: "accounting.reports.list",
						path: () => "/accounting/reports/list",
						route: "/list",
					},
				},
			},
		},
	},
} as const;

export type RouteId = (typeof ROUTES)[keyof typeof ROUTES]["id"];
