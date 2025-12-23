// app/languages/page.tsx - Canonical Language Selection Page
import { getCurrentUser, getRoleDashboard } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LanguageSelection } from "@/components/onboarding/LanguageSelection";

export default async function LanguagePage() {
    const user = await getCurrentUser();
    if (user) {
        redirect(getRoleDashboard(user.role));
    }

    const cookieStore = await cookies();
    const initialLang = cookieStore.get("bd_lang")?.value || "en";

    return (
        <div className="bd-container flex items-center justify-center min-h-[80vh] py-10">
            <LanguageSelection initialLang={initialLang} />
        </div>
    );
}
