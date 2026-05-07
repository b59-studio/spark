"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type SessionOk = {
  authenticated: true;
  user: {
    id: string;
    email: string;
    name: string | null;
    mapAccess: {
      assignments: { roleName: string; precinctId: number | null; blockId: number | null }[];
      labels: string[];
    };
  };
};

type SessionRes = SessionOk | { authenticated: false };

export default function MapSessionBanner() {
  const [session, setSession] = useState<SessionRes | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (res.status === 401) {
        setSession({ authenticated: false });
        return;
      }
      const data = (await res.json()) as SessionRes;
      setSession(data);
    } catch {
      setSession({ authenticated: false });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (session === null) {
    return (
      <div className="mb-4 rounded-lg border border-spark-bone/10 bg-spark-bone/5 px-4 py-3 text-sm text-spark-bone/60">
        Checking session…
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-spark-bone/15 bg-spark-bone/5 px-4 py-3 text-sm text-spark-bone/85">
        <span>
          Sign in with your magic link to associate this session with your precinct or block
          role and unlock scoped map access when enforcement is enabled.
        </span>
        <Link
          href="/login"
          className="shrink-0 rounded-lg bg-spark-bone px-4 py-2 text-sm font-semibold text-spark-void shadow-sm ring-1 ring-spark-bg/15 transition hover:bg-spark-bone/90 hover:ring-spark-bg/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold/80"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const display =
    session.user.name?.trim() ||
    session.user.email ||
    "Signed in";

  return (
    <div className="mb-4 rounded-lg border border-spark-bone/15 bg-spark-bone/5 px-4 py-3 text-sm text-spark-bone/90">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-spark-bone">{display}</p>
          {session.user.mapAccess.labels.length > 0 ? (
            <ul className="mt-1 list-inside list-disc text-xs text-spark-bone/75">
              {session.user.mapAccess.labels.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-spark-bone/65">
              No role assignments yet — map visibility will follow your{" "}
              <code className="rounded bg-spark-bone/10 px-1">UserRole</code> rows.
            </p>
          )}
        </div>
        <form action="/api/auth/logout" method="post">
          <input type="hidden" name="next" value="/map" />
          <button
            type="submit"
            className="shrink-0 rounded-md border border-spark-bone/25 px-3 py-1.5 text-xs text-spark-bone/90 hover:bg-spark-bone/10"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
