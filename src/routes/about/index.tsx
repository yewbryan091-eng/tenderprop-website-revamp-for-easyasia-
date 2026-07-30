import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tender/PageShell";

export const Route = createFileRoute("/about/")({ component: Page });

function Page() {
  return (
    <PageShell
      eyebrow="Who runs TenderProp"
      title={<>Why your money is <em>safe here</em></>}
      lede="TenderProp is run by a licensed Malaysian real estate agency. Your tender deposit is held by the agency as stakeholder and refunded in full if no sale proceeds — this page exists to prove that, not to tell a company story."
      frames={[
        { title: "Who we are", what: "The One Property Global — licensed estate agency, the people who actually run your deal.", blocked: "real REN/REA + agency registration numbers" },
        { title: "The licence", what: "Act 242 / BOVAEP — what the law obliges a licensed agency to do with your money." },
        { title: "Where your deposit sits", what: "Stakeholder-held, counts toward your 10%, refunded in full if your offer is not accepted." },
        { title: "Office & contact", what: "No. 23B, Jalan USJ 10/1C, 47620 Subang Jaya · (+603) 8021 6468 — with the contact form. The live site's 'coming soon' About page dies here." },
      ]}
    />
  );
}
