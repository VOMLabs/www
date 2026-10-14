import { Link, useRouter } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import { getErrorMessage, isDatabaseError } from "@/lib/errors";

type ErrorStatus = 401 | 500 | 503;

const isUnauthorized = (error: Error) => error.message === "Unauthorized";

function classifyError(error: Error): {
  status: ErrorStatus;
  title: string;
  description: string;
  detail: string;
} {
  if (isUnauthorized(error)) {
    return {
      status: 401,
      title: "Sign in required",
      description: "This part of the site is only for signed-in users.",
      detail:
        "Sign in to access your dashboard, downloads, and account settings.",
    };
  }

  if (isDatabaseError(error)) {
    return {
      status: 503,
      title: "Database unavailable",
      description: "We couldn't reach our database.",
      detail:
        "This is usually temporary — the database may be restarting or briefly unreachable. Please try again in a moment.",
    };
  }

  return {
    status: 500,
    title: "Something went wrong",
    description: "An unexpected error occurred.",
    detail: "Please try again. If the problem persists, contact support.",
  };
}

export function ErrorPage({ error }: { error: Error }) {
  const router = useRouter();
  const { status, title, description, detail } = classifyError(error);
  const message = getErrorMessage(error);

  return (
    <main className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="animate-fade-up flex max-w-md flex-col items-center gap-8 motion-reduce:animate-none">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          Error {status}
        </p>

        <div className="space-y-2">
          <h1 className="display">{title}</h1>
          <p className="lead">{description}</p>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {detail}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {status === 401 ? (
            <>
              <Link className={buttonVariants({ size: "lg" })} to="/login">
                Sign in
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4"
                to="/"
              >
                Back to home
              </Link>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  void router.invalidate();
                }}
                type="button"
              >
                Try again
              </Button>
              <Link
                className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4"
                to="/"
              >
                Go home
              </Link>
            </>
          )}
        </div>

        {message && import.meta.env?.DEV && (
          <pre className="border-border bg-muted text-muted-foreground w-full max-w-sm overflow-x-auto border px-4 py-3 text-left font-mono text-[11px] break-all">
            {message}
          </pre>
        )}
      </div>
    </main>
  );
}
