import { redirect } from "next/navigation";

// Redirect old vibe-coder URL to extensions page
export default function VibeCoderRedirect() {
  redirect("/extensions");
}
