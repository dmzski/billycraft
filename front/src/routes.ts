export type QuoteRouteProps = {
  id: string
}

export type BillRouteProps = {
  id: string
}

export type CustomerRouteProps = {
  id: string
}

export type SupplierRouteProps = {
  id: string
}

export type OutgoingRouteProps = {
  id: string
}

export type ReportRouteProps = {
  id: string
}

const DEFAULT_QUOTE_ROUTE_PARAMS: QuoteRouteProps = { id: ":id" }
const DEFAULT_BILL_ROUTE_PARAMS: BillRouteProps = { id: ":id" }
const DEFAULT_CUSTOMER_ROUTE_PARAMS: CustomerRouteProps = { id: ":id" }
const DEFAULT_SUPPLIER_ROUTE_PARAMS: SupplierRouteProps = { id: ":id" }
const DEFAULT_OUTGOING_ROUTE_PARAMS: OutgoingRouteProps = { id: ":id" }
const DEFAULT_REPORT_ROUTE_PARAMS: ReportRouteProps = { id: ":id" }



export const ROUTES = {
  LOGIN: {
    id: "login",
    path: () => '/login',
  },
  REGISTER: {
    id: "register",
    path: () => '/register',
  },
  BILLS: {
    id: "bills",
    exact: true,
    path: () => '/bills',
  },
  BILL_FORM: {
    id: "bills.form",
    path: (params = DEFAULT_BILL_ROUTE_PARAMS) => `/bills/edit/${params.id}`,
  },
  BILL_ADD: {
    id: "bills.form",
    path: () => `/bills/create`,
  },
  BILL_EDIT: {
    id: "bills.form",
    path: (params = DEFAULT_BILL_ROUTE_PARAMS) => `/bills/edit/${params.id}`,
  },
  BILL_OVERVIEW: {
    id: "bills.form",
    path: (params = DEFAULT_BILL_ROUTE_PARAMS) => `/bills/overview/${params.id}`,
  },
  CUSTOMERS: {
    id: "customers",
    exact: true,
    path: () => '/customers',
  },
  CUSTOMER_ADD: {
    id: "customers.add",
    path: () => '/customers/create',
  },
  CUSTOMER_EDIT: {
    id: "customers.edit",
    path: (params = DEFAULT_CUSTOMER_ROUTE_PARAMS) => `/customers/edit/${params.id}`,
  },
  DASHBOARD: {
    id: "dashboard",
    path: () => '/dashboard',
  },
  HISTORY: {
    exact: false,
    id: "history",
    path: () => '/history',
    routes: {
      QUOTES: {
        id: "history.quotes",
        exact: true,
        path: () => `${ROUTES.HISTORY.path()}/quotes`,
        routes: {
          ARCHIVED: {
            id: "history.quotes.archived",
            exact: true,
            path: () => `${ROUTES.HISTORY.routes.QUOTES.path()}/archived`,
          },
          REFUSED: {
            id: "history.quotes.refused",
            exact: true,
            path: () => `${ROUTES.HISTORY.routes.QUOTES.path()}/refused`,
          },
        },
      },
      BILLS: {
        id: "history.bills",
        exact: true,
        path: () => '/history/bills',
        routes: {
          ARCHIVED: {
            id: "history.bills.archived",
            exact: true,
            path: () => '/history/bills/archived',
          },
          REFUSED: {
            id: "history.bills.refused",
            exact: true,
            path: () => '/history/bills/refused',
          },
        },
      },
      TODOS: {
        id: "history.todos",
        exact: true,
        path: () => '/history/todos',
      },
    },
  },
  ONBOARDING: {
    id: "onboarding",
    path: () => '/onboarding',
  },
  ONBOARDING_CREATE: {
    id: "onboarding.create",
    path: () => '/onboarding/create-organization',
  },
  ONBOARDING_JOIN: {
    id: "onboarding.join",
    path: () => '/onboarding/join-organization',
  },
  PRODUCTS: {
    id: "products",
    exact: true,
    path: () => '/products',
  },
  QUOTES: {
    id: "quotes",
    exact: true,
    path: () => '/quotes',
  },
  QUOTE_OVERVIEW: {
    id: "quotes.overview",
    exact: true,
    path: (params = DEFAULT_QUOTE_ROUTE_PARAMS) => `/quotes/overview/${params.id}`,
  },
  QUOTE_EDIT: {
    id: "quotes.edit",
    path: (params = DEFAULT_QUOTE_ROUTE_PARAMS) => `/quotes/edit/${params.id}`,
  },
  QUOTE_ADD: {
    id: "quotes.add",
    path: () => '/quotes/create',
  },
  SETTINGS: {
    id: 'settings',
    exact: false,
    path: () => '/settings',
    routes: {
      MY_COMPANY: {
        id: 'settings.myOrganization',
        exact: true,
        path: () => '/settings/my-company',
      },
      QUOTE_CUSTOMIZATION: {
        id: 'settings.quoteCustomization',
        exact: true,
        path: () => '/settings/quote-customization',
      },
      BILL_CUSTOMIZATION: {
        id: 'settings.billCustomization',
        exact: true,
        path: () => '/settings/bill-customization',
      },
    },
  },
  SUPPLIERS: {
    id: 'suppliers',
    exact: true,
    path: () => '/suppliers',
  },
  SUPPLIERS_FORM: {
    id: 'suppliers.form',
    path: (params = DEFAULT_SUPPLIER_ROUTE_PARAMS) => `/suppliers/${params.id}`,
  },
  ACCOUNTINGS: {
    id: 'accounting',
    path: () => '/accounting',
    routes: {
      OUTGOINGS: {
        id: "accounting.outgoings",
        exact: true,
        path: () => '/accounting/outgoings',
        routes: {
          OVERVIEW: {
            id: "accounting.outgoings.overview",
            exact: true,
            path: () => '/accounting/outgoings/overview',
          },
          LIST: {
            id: "accounting.outgoings.list",
            exact: true,
            path: () => '/accounting/outgoings/list',
          },
          FORM: {
            id: "accounting.outgoings.form",
            path: (params = DEFAULT_OUTGOING_ROUTE_PARAMS) => `/accounting/outgoings/edit/${params.id}`,
          },
          DETAILS: {
            id: "accounting.outgoings.details",
            path: (params = DEFAULT_OUTGOING_ROUTE_PARAMS) => `/accounting/outgoings/details/${params.id}`,
          },
        },
      },
      REPORTS: {
        exact: true,
        id: "accounting.reports",
        path: () => '/accounting/reports',
        routes: {
          OVERVIEW: {
            id: "accounting.reports.overview",
            exact: true,
            path: () => '/accounting/reports/overview',
          },
          DETAILS: {
            id: "accounting.reports.details",
            path: (params = DEFAULT_REPORT_ROUTE_PARAMS) => `/accounting/reports/details/${params.id}`,
          },
          LIST: {
            exact: true,
            id: "accounting.reports.list",
            path: () => '/accounting/reports/list',
          },
        },
      },
    },
  },
} as const

export type RouteId = typeof ROUTES[keyof typeof ROUTES]['id']
