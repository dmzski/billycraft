import { HomeIcon } from '@heroicons/react/24/solid'
import { ComponentProps, ComponentType } from 'react'

export type Route = {
  exact?: boolean
  path: string
  title: string
  routes?: Record<string, Route>
  icon?: ComponentType<ComponentProps<typeof HomeIcon>>
}

export const injectIdInPath = (route: string, id: number | string) => route.replace(':id', `${id}`)

export const ROUTES = {
  LOGIN: {
    path: '/login',
  },
  REGISTER: {
    path: '/register',
  },
  BILLS: {
    exact: true,
    path: '/bills',
    title: 'Factures',
  },
  BILL_FORM: {
    path: '/bills/edit/:id',
    title: 'Edition de facture',
  },
  CUSTOMERS: {
    exact: true,
    path: '/customers',
    title: 'Clients',
  },
  CUSTOMER_ADD: {
    path: '/customers/create',
    title: 'Ajouter un client',
  },
  CUSTOMER_EDIT: {
    path: '/customers/edit/:id',
    title: 'Edition de client',
  },
  DASHBOARD: {
    path: '/dashboard',
    title: 'Accueil',
  },
  HISTORY: {
    exact: false,
    path: '/history',
    title: 'Historique',
    routes: {
      QUOTES: {
        exact: true,
        path: '/history/quotes',
        title: 'Devis',
        routes: {
          ARCHIVED: {
            exact: true,
            path: '/history/quotes/archived',
            title: 'Devis > Archivés',
          },
          REFUSED: {
            exact: true,
            path: '/history/quotes/refused',
            title: 'Devis > Refusés',
          },
        },
      },
      BILLS: {
        exact: true,
        path: '/history/bills',
        title: 'Factures',
        routes: {
          ARCHIVED: {
            exact: true,
            path: '/history/bills/archived',
            title: 'Factures > Archivées',
          },
          REFUSED: {
            exact: true,
            path: '/history/bills/refused',
            title: 'Factures > Refusées',
          },
        },
      },
      TODOS: {
        exact: true,
        path: '/history/todos',
        title: 'Tâches',
      },
    },
  },
  ONBOARDING: {
    path: '/onboarding',
    title: 'Bienvenue sur Coco ERP',
  },
  ONBOARDING_CREATE: {
    path: '/onboarding/create-organization',
    title: 'Créer mon entreprise',
  },
  ONBOARDING_JOIN: {
    path: '/onboarding/join-organization',
    title: 'Rejoindre une entreprise',
  },
  PRODUCTS: {
    exact: true,
    path: '/products',
    title: 'Articles',
  },
  QUOTES: {
    exact: true,
    path: '/quotes',
    title: 'Devis',
  },
  QUOTE_OVERVIEW: {
    exact: true,
    path: '/quotes/overview/:id',
    title: "Détail d'un devis",
  },
  QUOTE_EDIT: {
    path: '/quotes/edit/:id',
    title: 'Edition de devis',
  },
  QUOTE_ADD: {
    path: '/quotes/create',
    title: 'Edition de devis',
  },
  SETTINGS: {
    exact: false,
    path: '/settings',
    title: 'Paramètres',
    routes: {
      MY_COMPANY: {
        exact: true,
        path: '/settings/my-company',
        title: 'Mon entreprise',
      },
      QUOTE_CUSTOMIZATION: {
        exact: true,
        path: '/settings/quote-customization',
        title: 'Personnalisation des devis',
      },
      BILL_CUSTOMIZATION: {
        exact: true,
        path: '/settings/bill-customization',
        title: 'Personnalisation des factures',
      },
    },
  },
  SUPPLIERS: {
    exact: true,
    path: '/suppliers',
    title: 'Fournisseurs',
  },
  SUPPLIERS_FORM: {
    path: '/suppliers/:id',
    title: 'Fournisseurs',
  },
  ACCOUNTINGS: {
    path: '/accounting',
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
          FORM: {
            path: '/accounting/outgoings/edit/:id',
            title: "Edition d'un livret d'achat",
          },
          DETAILS: {
            path: '/accounting/outgoings/details/:id',
            title: "Détail d'un livret d'achat",
          },
        },
      },
      REPORTS: {
        exact: true,
        path: '/accounting/reports',
        title: 'Rapports',
        routes: {
          OVERVIEW: {
            exact: true,
            path: '/accounting/reports/overview',
            title: "Rapports > Vue d'ensemble",
          },
          DETAILS: {
            path: '/accounting/reports/details/:id',
            title: 'Rapports > Détails',
          },
          LIST: {
            exact: true,
            path: '/accounting/reports/list',
            title: 'Rapports > Tous mes rapports',
          },
        },
      },
    },
  },
} as const
