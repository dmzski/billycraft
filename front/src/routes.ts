export const ROUTES = {
  DASHBOARD: {
    path: "/dashboard",
    title: "Accueil",
    icon: "chart-pie",
  },
  QUOTES: {
    path: "/quotes",
    title: "Devis",
    icon: "document-text",
    exact: true,
  },
  BILLS: {
    path: "/bills",
    title: "Factures",
    icon: "cash",
    exact: true,
  },
  BILL_FORM: {
    path: "/bills/edit/:id",
    title: "Edition de facture",
  },
  QUOTE_FORM: {
    path: "/quotes/edit/:id",
    title: "Edition de devis",
  },
  CUSTOMERS: {
    path: "/customers",
    title: "Clients",
    icon: "user-group",
    exact: true,
  },
  CUSTOMER_FORM: {
    path: "/customer/edit/:id",
    title: "Edition de client",
  },
  SETTINGS: {
    path: "/settings",
    exact: true,
    title: "Paramètres",
    icon: "cog",
  },

  SUPPORT: {
    path: "/support",
    exact: true,
    title: "Support",
    icon: "",
  },
  ONBOARDING_COMPANY: {
    path: "/onboarding/create-company",
    title: "Créer mon entreprise",
  },
  PRODUCTS: {
    path: "/products",
    title: "Articles",
    exact: true,
    icon: "cube",
  },
  HISTORY: {
    path: "/history",
    title: "Historique",
    exact: false,
    icon: "archive",
  },
};
