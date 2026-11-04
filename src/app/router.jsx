import { createBrowserRouter } from "react-router";

import MainLayout from "./layouts/MainLayout";
import RequestProvider from "../features/request/context/RequestContext";

import { lazy } from "react";

const HomePage = lazy(() => import("../pages/HomePage"));
const ServicesPage = lazy(() => import("../pages/ServicesPage"));
const ServiceDetailsPage = lazy(() => import("../pages/ServiceDetailsPage"));
const PackagesPage = lazy(() => import("../pages/PackagesPage"));
const PackageDetailsPage = lazy(() => import("../pages/PackageDetailsPage"));
const WorkPage = lazy(() => import("../pages/WorkPage"));
const ProjectDetailsPage = lazy(() => import("../pages/ProjectDetailsPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const RequestPage = lazy(() => import("../pages/RequestPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,

    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "services",
        Component: ServicesPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
            ],
            labelKey: "common.services",
            to: "/services",
          },
        },
      },
      {
        path: "services/:slug",
        Component: ServiceDetailsPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
              {
                labelKey: "common.services",
                to: "/services",
              },
            ],
            resource: "service",
          },
        },
      },
      {
        path: "packages",
        Component: PackagesPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
            ],
            labelKey: "common.packages",
            to: "/packages",
          },
        },
      },
      {
        path: "packages/:slug",
        Component: PackageDetailsPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
              {
                labelKey: "common.packages",
                to: "/packages",
              },
            ],
            resource: "package",
          },
        },
      },
      {
        path: "work",
        Component: WorkPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
            ],
            labelKey: "common.work",
            to: "/work",
          },
        },
      },
      {
        path: "work/:slug",
        Component: ProjectDetailsPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
              {
                labelKey: "common.work",
                to: "/work",
              },
            ],
            resource: "project",
          },
        },
      },
      {
        path: "about",
        Component: AboutPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
            ],
            labelKey: "common.about",
          },
        },
      },
      {
        path: "contact",
        Component: ContactPage,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
            ],
            labelKey: "common.contact",
          },
        },
      },
      {
        path: "request",
        Component: RequestProvider,
        handle: {
          breadcrumb: {
            parents: [
              {
                labelKey: "common.home",
                to: "/",
              },
            ],
            labelKey: "common.startProject",
          },
        },
        children: [
          {
            index: true,
            Component: RequestPage,
          },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
], {
  // Matches Vite's `base` so routing works both locally and under the
  // GitHub Pages sub-path (e.g. `/helaly-website/`).
  basename: import.meta.env.BASE_URL,
});

export default router;