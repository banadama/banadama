// app/(public)/page.tsx - Landing Page
import { Hero } from "@/components/sections/Hero";
import { WhyBanadama } from "@/components/sections/WhyBanadama";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export const metadata = {
    title: "Banadama - Buy Now + RFQ Marketplace | Nigeria & Bangladesh",
    description:
        "Escrow-backed trade with verified suppliers and ops-managed fulfillment. Local buying (NG/BD) and global buy-only access in one marketplace.",
};

export default function Home() {
    return (
        <>
            <Hero />
            <WhyBanadama />
            <HowItWorks />
            <CTA />
            <Footer />
        </>
    );
}
