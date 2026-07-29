import { createFileRoute, redirect } from "@tanstack/react-router";
/* Retired 30 Jul 2026 (Bryan): see /buy. */
export const Route = createFileRoute("/rent/")({
  beforeLoad: () => { throw redirect({ to: "/owner-auction" }); },
});
