import { IconName } from '@coco-ui/core/dist/components/Icon'

export type Route = {
  exact?: boolean
  icon?: IconName
  path: string
  title: string
  routes?: Record<string, Route>
}

export const ROUTES = {
  BILLS: {
    exact: true,
    icon: 'cash',
    path: '/bills',
    title: 'Factures',
  },
  BILL_FORM: {
    path: '/bills/edit/:id',
    title: 'Edition de facture',
  },
  CALENDAR: {
    exact: true,
    icon: 'calendar',
    path: '/calendar',
    title: 'Calendrier',
  },
  CUSTOMERS: {
    exact: true,
    icon: 'user-group',
    path: '/customers',
    title: 'Clients',
  },
  CUSTOMER_FORM: {
    path: '/customers/edit/:id',
    title: 'Edition de client',
  },
  DASHBOARD: {
    icon: 'view-grid',
    path: '/dashboard',
    title: 'Accueil',
  },
  HISTORY: {
    exact: false,
    icon: 'archive',
    path: '/history',
    title: 'Historique',
  },
  ONBOARDING_COMPANY: {
    path: '/onboarding/create-company',
    title: 'Créer mon entreprise',
  },
  PRODUCTS: {
    exact: true,
    icon: 'cube',
    path: '/products',
    title: 'Articles',
  },
  QUOTES: {
    exact: true,
    icon: 'document-text',
    path: '/quotes',
    title: 'Devis',
  },
  QUOTE_FORM: {
    path: '/quotes/edit/:id',
    title: 'Edition de devis',
  },
  SETTINGS: {
    exact: true,
    icon: 'cog',
    path: '/settings',
    title: 'Paramètres',
  },
  SUPPORT: {
    exact: true,
    icon: 'support',
    path: '/support',
    title: 'Support',
  },
  SUPPLIERS: {
    exact: true,
    icon: 'truck',
    path: '/suppliers',
    title: 'Fournisseurs',
  },
  SUPPLIERS_FORM: {
    path: '/suppliers/:id',
    title: 'Fournisseurs',
  },
  ACCOUNTINGS: {
    path: '/accounting',
    icon: 'chart-square-bar',
    title: 'Comptabilité',
    routes: {
      OUTGOINGS: {
        exact: true,
        path: '/accounting/outgoings',
        title: "Livrets d'achats",
        routes: {
          OVERVIEW: {
            exact: true,
            path: '/accounting/outgoings/overview',
            title: "Livrets d'achats > Vue d'ensemble",
          },
          LIST: {
            exact: true,
            path: '/accounting/outgoings/list',
            title: "Livrets d'achats > Tous les livrets d'achats",
          },
        },
      },
      REPORTS: {
        exact: true,
        path: '/accounting/reports',
        title: 'Statistiques',
      },
    },
  },
}
