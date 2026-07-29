import { createFileRoute, redirect } from "@tanstack/react-router";
/* Retired 30 Jul 2026 (Bryan): buy/rent are gone — tender and owner auction are
   the only ways to buy. Redirect keeps old inbound links alive. */
export const Route = createFileRoute("/buy/")({
  beforeLoad: () => { throw redirect({ to: "/tender" }); },
});
