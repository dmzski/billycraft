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
	},
	REGISTER: {
		id: "register",
		path: () => "/register",
	},
	BILLS: {
		id: "bills",
		exact: true,
		path: (query?: BillRouteQueryParams) =>
			`/bills${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
	},
	BILL_FORM: {
		id: "bills.form",
		path: (params = DEFAULT_BILL_ROUTE_PARAMS) => `/bills/edit/${params.id}`,
	},
	BILL_ADD: {
		id: "bills.form",
		path: () => "/bills/create",
	},
	BILL_EDIT: {
		id: "bills.form",
		path: (params = DEFAULT_BILL_ROUTE_PARAMS) => `/bills/edit/${params.id}`,
	},
	BILL_OVERVIEW: {
		id: "bills.form",
		path: (
			params = DEFAULT_BILL_ROUTE_PARAMS,
			query?: BillOverviewRouteQueryParams,
		) =>
			`/bills/overview/${params.id}${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
	},
	CUSTOMERS: {
		id: "customers",
		exact: true,
		path: () => "/customers",
	},
	CUSTOMER_ADD: {
		id: "customers.add",
		path: () => "/customers/create",
	},
	CUSTOMER_EDIT: {
		id: "customers.edit",
		path: (params = DEFAULT_CUSTOMER_ROUTE_PARAMS) =>
			`/customers/edit/${params.id}`,
	},
	CUSTOMER_OVERVIEW: {
		id: "customers.overview",
		path: (params = DEFAULT_CUSTOMER_ROUTE_PARAMS) =>
			`/customers/overview/${params.id}`,
	},
	DASHBOARD: {
		id: "dashboard",
		path: () => "/dashboard",
	},
	HISTORY: {
		exact: false,
		id: "history",
		path: () => "/history",
		routes: {
			TODOS: {
				id: "history.todos",
				exact: true,
				path: () => "/history/todos",
			},
		},
	},
	ONBOARDING: {
		id: "onboarding",
		path: () => "/onboarding",
	},
	ONBOARDING_CREATE: {
		id: "onboarding.create",
		path: () => "/onboarding/create-organization",
	},
	ONBOARDING_JOIN: {
		id: "onboarding.join",
		path: () => "/onboarding/join-organization",
	},
	PRODUCTS: {
		id: "products",
		exact: false,
		path: () => "/products",
		routes: {
			LIST: {
				exact: true,
				path: () => "/products/list",
				id: "products.list",
			},
			GROUPS: {
				exact: true,
				path: () => "/products/groups",
				id: "products.groups",
			},
		},
	},
	QUOTES: {
		id: "quotes",
		exact: true,
		path: (query?: QuoteRouteQueryParams) =>
			`/quotes${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
	},
	QUOTE_OVERVIEW: {
		id: "quotes.overview",
		exact: true,
		path: (
			params = DEFAULT_QUOTE_ROUTE_PARAMS,
			query?: QuoteOverviewRouteQueryParams,
		) =>
			`/quotes/overview/${params.id}${query ? `?${new URLSearchParams(query).toString()}` : ""}`,
	},
	QUOTE_EDIT: {
		id: "quotes.edit",
		path: (params = DEFAULT_QUOTE_ROUTE_PARAMS) => `/quotes/edit/${params.id}`,
	},
	QUOTE_ADD: {
		id: "quotes.add",
		path: () => "/quotes/create",
	},
  ACCOUNT: {
    id: "account",
    exact: true,
    path: () => "/account",
  },
  ORGANIZATION: {
    id: 'organization',
    path: () => "/organization/",
    exact: false,
    routes: {
      SETTINGS: {
				id: "organization.settings",
				exact: true,
				path: () => "/organization/settings",
      },
      USERS: {
				id: "organization.users",
				exact: false,
				path: () => "/organization/users",
				routes: {
					USERS: {
						id: "organization.users.users",
						exact: true,
						path: () => "/organization/users/users",
					},
					INVITATIONS: {
						id: "organization.users.invitations",
						exact: true,
						path: () => "/organization/users/invitations",
					},
				},
      },
      CUSTOMIZATION: {
        id: 'organization.customization',
        exact: false,
        path: () => "/organization/customization",
        routes: {
          BILL: {
            id: 'organization.customization.bill',
            exact: true,
            path: () => "/organization/customization/bill",
          },
          QUOTE: {
            id: 'organization.customization.quote',
            exact: true,
            path: () => "/organization/customization/quote",
          }
        }
      }
    }
  },
	SUPPLIERS: {
		id: "suppliers",
		exact: true,
		path: () => "/suppliers",
	},
	SUPPLIERS_FORM: {
		id: "suppliers.form",
		path: (params = DEFAULT_SUPPLIER_ROUTE_PARAMS) => `/suppliers/${params.id}`,
	},
	ACCOUNTINGS: {
		id: "accounting",
		path: () => "/accounting",
		routes: {
			OUTGOINGS: {
				id: "accounting.outgoings",
				exact: false,
				path: () => "/accounting/outgoings",
				routes: {
					OVERVIEW: {
						id: "accounting.outgoings.overview",
						exact: true,
						path: () => "/accounting/outgoings/overview",
					},
					LIST: {
						id: "accounting.outgoings.list",
						exact: true,
						path: () => "/accounting/outgoings/list",
					},
					FORM: {
						id: "accounting.outgoings.form",
						path: (params = DEFAULT_OUTGOING_ROUTE_PARAMS) =>
							`/accounting/outgoings/edit/${params.id}`,
					},
					DETAILS: {
						id: "accounting.outgoings.details",
						path: (params = DEFAULT_OUTGOING_ROUTE_PARAMS) =>
							`/accounting/outgoings/details/${params.id}`,
					},
				},
			},
			REPORTS: {
				exact: false,
				id: "accounting.reports",
				path: () => "/accounting/reports",
				routes: {
					OVERVIEW: {
						id: "accounting.reports.overview",
						exact: true,
						path: () => "/accounting/reports/overview",
					},
					DETAILS: {
						id: "accounting.reports.details",
						path: (params = DEFAULT_REPORT_ROUTE_PARAMS) =>
							`/accounting/reports/details/${params.id}`,
					},
					LIST: {
						exact: true,
						id: "accounting.reports.list",
						path: () => "/accounting/reports/list",
					},
				},
			},
		},
	},
} as const;

export type RouteId = (typeof ROUTES)[keyof typeof ROUTES]["id"];
