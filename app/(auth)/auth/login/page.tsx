// app/(auth)/auth/login/page.tsx - Redirects to home (using modal)
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  // If user is logged in, redirect to their dashboard
  if (user) {
    redirect("/buyer/dashboard");
  }
  // Redirect to home where login is available as modal
  redirect("/");
}
