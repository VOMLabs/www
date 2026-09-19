import { createFileRoute } from "@tanstack/react-router";

import { getAdminStats } from "@/lib/db/functions";

export const Route = createFileRoute("/admin/")({
  loader: async () => getAdminStats(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { faqCount, userCount } = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          Admin
        </p>
        <h1 className="section-title">Dashboard</h1>
      </div>
      <div className="border-border bg-border grid grid-cols-1 gap-px sm:grid-cols-2">
        <div className="bg-background rounded-lg p-6">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
            FAQ Items
          </p>
          <p className="mt-3 text-3xl font-medium tracking-[-0.02em]">
            {faqCount}
          </p>
        </div>
        <div className="bg-background rounded-lg p-6">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
            Accounts
          </p>
          <p className="mt-3 text-3xl font-medium tracking-[-0.02em]">
            {userCount}
          </p>
        </div>
      </div>
    </div>
  );
}
