import { createFileRoute } from "@tanstack/react-router";

import { AuctionSinaranDetail } from "@/components/tender/AuctionSinaranDetail";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";

/* The Owner Auction listing page for Residensi Sinaran. Same property as
   /tender/residensi-sinaran, different product — two separate pages by Bryan's
   instruction, 10 Aug. Own title and description so the two do not compete for the
   same search result. */
export const Route = createFileRoute("/owner-auction/residensi-sinaran")({
  head: () => ({
    meta: [
      { title: "Residensi Sinaran, Shah Alam — Owner Auction | TenderProp" },
      {
        name: "description",
        content:
          "Residensi Sinaran, Taman Sri Muda, Shah Alam. Townhouse going under Owner Auction on 12 December 2026 at 9:00 AM MYT; registration closes 11 December.",
      },
      { property: "og:title", content: "Residensi Sinaran, Shah Alam — Owner Auction" },
      {
        property: "og:description",
        content: "Owner Auction: 12 December 2026, 9:00 AM MYT. Register by 11 December to bid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <AuctionSinaranDetail />
      <SiteFooter />
    </>
  ),
});
