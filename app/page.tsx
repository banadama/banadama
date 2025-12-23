// app/page.tsx - Redirect to Canonical Landing
import { redirect } from "next/navigation";

export default function RootPage() {
    redirect("/landing");
}
