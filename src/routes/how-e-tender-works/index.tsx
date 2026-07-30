import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tender/PageShell";

export const Route = createFileRoute("/how-e-tender-works/")({ component: Page });

/* Framed now so the hero's signal has somewhere real to land — a prominent link to a 404
   is worse than no link. Content is a rebuild of the live /how-to-tender page, which is
   genuinely good: it is where the 5-working-day result window and the member-account
   deposit timing were recovered from. Named "How E-Tender works", not "How To E-Tender":
   the latter reads badly as a verb phrase, and the homepage already uses this wording. */
function Page() {
  return (
    <PageShell
      eyebrow="For buyers — the method, start to finish"
      title={<>How <em>E-Tender</em> works</>}
      lede="A sealed offer, one closing date, and a licensed agency handling the deal end to end. Six steps from registering an account to hearing the seller's answer — and what happens to your deposit either way."
      frames={[
        { title: "Why buyers choose e-tender", what: "Fully online · flexibility on your offer · a refundable deposit · a licensed agency running it. The four points the live page already makes." },
        { title: "The six steps", what: "Join as a member → choose a property → view it with the agent → submit your sealed offer → place the deposit in your member account → receive the result." },
        { title: "After the close", what: "Results within 5 working days. Accepted, countered, or your deposit returned in full immediately." },
        { title: "What the deposit is", what: "3% of the reserve, and the first slice of the standard 10% down payment — not an extra cost. Lifted from the detail page's payment ladder." },
        { title: "E-Tender vs Owner Auction", what: "Short comparison with a link to /sell for owners.", blocked: "the full comparison table on /sell" },
      ]}
    />
  );
}
