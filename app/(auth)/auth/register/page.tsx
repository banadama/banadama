// app/(auth)/auth/register/page.tsx - Registration Page
import { getCurrentUser, getRoleDashboard } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(getRoleDashboard(user.role));
  }

  return (
    <div className="bd-container flex items-center justify-center min-h-screen py-10">
      <RegisterForm />
    </div>
  );
}
