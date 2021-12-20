import { IconName } from '@coco-ui/core/dist/components/Icon'

export const ROUTES: Record<
  string,
  {
    exact?: boolean
    icon?: IconName
    path: string
    title: string
  }
> = {
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
  REPORTS: {
    exact: true,
    icon: 'chart-square-bar',
    path: '/reports',
    title: 'Statistiques',
  },
}
