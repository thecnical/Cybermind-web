import { redirect } from "next/navigation";

// FIX: renamed to CBM Code — redirect old URL permanently
export default function VibeCoderRedirect() {
  redirect("/cbm-code");
}
