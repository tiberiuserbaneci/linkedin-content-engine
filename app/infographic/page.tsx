import { Metadata } from "next";
import { InfographicTemplate } from "./infographic-template";

export const metadata: Metadata = {
  title: "Founder AI Stack 2026 – LinkedIn Infographic",
  description:
    "7 automations replacing full-time hires. Total cost: $85/month.",
};

export default function InfographicPage() {
  return <InfographicTemplate />;
}
