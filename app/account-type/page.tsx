// app/account-type/page.tsx - Canonical Account Type Page
import { getCurrentUser, getRoleDashboard } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AccountTypeSelection } from "@/components/onboarding/AccountTypeSelection";

export default async function AccountTypePage() {
    const user = await getCurrentUser();
    if (user) {
        redirect(getRoleDashboard(user.role));
    }

    const cookieStore = await cookies();
    const initialRole = cookieStore.get("bd_intent_role")?.value || "BUYER";
    const initialSubtype = cookieStore.get("bd_intent_subtype")?.value || "";
    const country = cookieStore.get("bd_country")?.value || "GLOBAL";
    const lang = cookieStore.get("bd_lang")?.value || "en";

    return (
        <div className="bd-container flex items-center justify-center min-h-[80vh] py-10">
            <AccountTypeSelection
                initialRole={initialRole}
                initialSubtype={initialSubtype}
                country={country}
                lang={lang}
            />
        </div>
    );
}
