import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tender/PageShell";

export const Route = createFileRoute("/member/")({ component: Page });

function Page() {
  return (
    <PageShell
      eyebrow="Member account"
      title={<>One account for <em>every e-tender</em></>}
      lede="Membership is required before you can submit an e-tender or bid — create the account once, verify, and every offer, deposit and result lives in one place. The dashboard design is being supplied by the founder; this page holds its frame."
      frames={[
        { title: "Sign in / Register", what: "Account creation and verification — step 1 of every e-tender.", blocked: "Bryan's member-dashboard design (parked by decision — do not design ahead of it)" },
        { title: "My e-tenders & deposits", what: "Submitted offers, deposit status, results — the live site pays deposits inside the member account, so this is where that happens." },
        { title: "Saved properties", what: "The Save button on listings lands here." },
      ]}
    />
  );
}
