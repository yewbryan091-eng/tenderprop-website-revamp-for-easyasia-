import { createFileRoute, useRouterState } from "@tanstack/react-router";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { TenderApplyForm } from "@/components/tender/TenderApplyForm";
import { TENDERS } from "@/data/tenders";
import { tenderId } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/tender-apply.css";

/* ── /tender/apply?listing=<id> ───────────────────────────────────────────────
   A ROUTE, not a modal over the listing. Three reasons, in order of weight:
     1. The founder's flow puts a sign-in / sign-up gate in front of this. A gate that
        can round-trip to an auth provider needs a URL to come back to; a modal loses
        its state the moment the page reloads.
     2. The detail page runs its own hash-scroll behaviour (lib/tender-detail-behaviour)
        and is ~2,000 lines. A modal would have to fight both.
     3. EasyAsia gets a clean contract — one page, one query parameter, one payload.

   The listing is a SEARCH PARAM rather than a path segment so this single route serves
   every listing the moment the backend supplies them, without a file per property. An
   unknown or missing id falls back to Residensi Sinaran, the only listing with a built
   detail page today. */

export const Route = createFileRoute("/tender/apply")({
  head: () => ({
    meta: [
      { title: "Submit your e-tender | TenderProp" },
      {
        name: "description",
        content:
          "Submit a sealed e-tender offer. Name your own price — the reserve is a guide, not a minimum. A licensed agent carries your offer to the seller.",
      },
      /* Not a page anyone should reach from search: it is a step inside a flow, and
         indexing it would land buyers on a form with no listing context. */
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  /* Read straight off the location rather than through validateSearch. Declaring a
     validated search schema here made `search` a REQUIRED prop on every <Link to="/tender">
     and <Link to="/owner-auction"> in the app — it broke SiteHeader, SiteFooter and both
     legacy redirects. The param is optional by design, so it does not need a schema. */
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const id = new URLSearchParams(searchStr).get("listing") ?? "";
  const listing = TENDERS.find((t) => tenderId(t) === id) ?? TENDERS.find((t) => t.name === "Residensi Sinaran") ?? TENDERS[0];

  return (
    <>
      <SiteHeader />
      <TenderApplyForm listing={listing} />
      <SiteFooter />
    </>
  );
}
