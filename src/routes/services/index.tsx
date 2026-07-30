import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tender/PageShell";

export const Route = createFileRoute("/services/")({ component: Page });

function Page() {
  return (
    <PageShell
      eyebrow="Member services — the whole transaction, handled"
      title={<>Win the keys, <em>then what?</em></>}
      lede="Membership is step one of tendering — and it carries the deal past the win: financing, conveyancing, renovation and investment guidance, all through TenderProp's panels. A portal lists properties; we carry transactions."
      frames={[
        { title: "The journey strip", what: "Win the tender → loan → legal → keys → renovation → next investment. One page, one argument — replaces four thin pages." },
        { title: "Loan Center", what: "Mortgage consultants, eligibility checks, pre-approval — including the named CIMB partnership (up to 95% + 5% financing) already published." },
        { title: "Legal Matter", what: "Panel solicitors for SPA, tenancy, loan and refinancing." },
        { title: "Interior Design & Renovation", what: "Design, construction and project management after handover." },
        { title: "Investment", what: "The secondary-market thesis from the live page, kept — it is decent copy and on-strategy." },
      ]}
    />
  );
}
