import { createFileRoute } from "@tanstack/react-router";

import { ResidensiSinaranDetail } from "@/components/tender/ResidensiSinaranDetail";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";

export const Route = createFileRoute("/tender/residensi-sinaran")({
  head: () => ({
    meta: [
      { title: "Residensi Sinaran, Shah Alam — Open for Tender | TenderProp" },
      {
        name: "description",
        content:
          "Residensi Sinaran, Taman Sri Muda, Shah Alam. 3-storey townhouse open for sealed e-tender at a RM517,000 reserve price with a refundable RM10,000 tender deposit.",
      },
      { property: "og:title", content: "Residensi Sinaran, Shah Alam — Open for Tender" },
      {
        property: "og:description",
        content:
          "Sealed e-tender: RM517,000 reserve, RM10,000 refundable deposit, handled by a licensed agent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <ResidensiSinaranDetail />
      <SiteFooter />
    </>
  ),
});
