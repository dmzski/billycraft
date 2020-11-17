import React from "react";
import Dashboard from "./pages/Dashboard";
import Quote from "./pages/Quote";
import QuoteForm from "./pages/QuoteForm";

export const ROUTES = {
  DASHBOARD: {
    path: "/dashboard",
    title: "Accueil",
    icon: "home",
  },
  QUOTES: {
    path: "/quotes",
    title: "Devis",
    icon: "description",
    exact: true,
  },
  BILLS: {
    path: "/bills",
    title: "Factures",
    icon: "payment",
    exact: true,
  },
  QUOTE_FORM: {
    path: "/quotes/edit/:id",
    title: "Edition de devis",
  },
  CUSTOMERS: {
    path: "/customers",
    title: "Clients",
    icon: "apartment",
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
    icon: "settings",
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
    icon: "widgets",
  },
};
