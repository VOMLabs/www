import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { ErrorPage } from "@/components/error-page";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,

    defaultErrorComponent: ({ error }) => (
      <ErrorPage
        error={error instanceof Error ? error : new Error(String(error))}
      />
    ),
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
