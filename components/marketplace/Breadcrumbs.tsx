import { Icons } from "@/components/icons/icons";

type From = "marketplace" | "near-me" | "global";

function baseFrom(from: From) {
    if (from === "near-me") return { label: "Near Me", href: "/near-me" };
    if (from === "global") return { label: "Global Market", href: "/global" };
    return { label: "Marketplace", href: "/marketplace" };
}

function buildResultsHref(from: From, qs: string) {
    const base = baseFrom(from).href;
    return qs ? `${base}?${qs}` : base;
}

export function Breadcrumbs({
    from,
    resultsQueryString,
    categoryName,
    categorySlug,
    productTitle,
}: {
    from: From;
    resultsQueryString: string; // already excludes product-only params
    categoryName?: string | null;
    categorySlug?: string | null;
    productTitle: string;
}) {
    const root = baseFrom(from);
    const resultsHref = buildResultsHref(from, resultsQueryString);

    // Category link keeps same query but sets category=
    const categoryHref = (() => {
        if (!categorySlug) return null;
        const p = new URLSearchParams(resultsQueryString);
        p.set("category", categorySlug);
        p.delete("page"); // category change resets paging
        return buildResultsHref(from, p.toString());
    })();

    const ChevronRightIcon = Icons.get("ChevronRight");

    return (
        <nav aria-label="Breadcrumb" className="bd-breadcrumbs">
            <a className="bd-bc-link" href={root.href}>
                {root.label}
            </a>

            <ChevronRightIcon size={16} />

            <a className="bd-bc-link" href={resultsHref}>
                Results
            </a>

            {categoryHref ? (
                <>
                    <ChevronRightIcon size={16} />
                    <a className="bd-bc-link" href={categoryHref}>
                        {categoryName ?? "Category"}
                    </a>
                </>
            ) : null}

            <ChevronRightIcon size={16} />

            <span className="bd-bc-current" title={productTitle}>
                {productTitle}
            </span>
        </nav>
    );
}
