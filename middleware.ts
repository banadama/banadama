import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml|.well-known).*)',
    ],
};

/**
 * MULTI-DOMAIN ROUTING MIDDLEWARE
 * 
 * Handles routing for:
 * - banadama.com / www.banadama.com -> Main marketplace (products only)
 * - supplier.banadama.com -> Supplier dashboard & onboarding
 * - ng.banadama.com -> Nigeria regional marketplace
 * - bd.banadama.com -> Bangladesh regional marketplace
 * - admin.banadama.com -> Admin panel
 * - ops.banadama.com -> Operations panel
 */

interface DomainInfo {
    type: 'main' | 'supplier' | 'regional' | 'admin' | 'ops';
    region?: 'NG' | 'BD' | 'GLOBAL';
}

function getDomainInfo(host: string): DomainInfo {
    // Normalize host (remove port for dev)
    const hostname = host.split(':')[0].toLowerCase();
    
    // Check for subdomain prefixes
    if (hostname.startsWith('supplier.')) return { type: 'supplier', region: 'GLOBAL' };
    if (hostname.startsWith('ng.')) return { type: 'regional', region: 'NG' };
    if (hostname.startsWith('bd.')) return { type: 'regional', region: 'BD' };
    if (hostname.startsWith('admin.')) return { type: 'admin' };
    if (hostname.startsWith('ops.')) return { type: 'ops' };
    // explicit main domain matches
    if (hostname === 'banadama.com' || hostname === 'www.banadama.com') return { type: 'main', region: 'GLOBAL' };
    
    // Dev override via query param for testing
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        const params = new URL(`http://${host}/`).searchParams;
        const hostParam = params.get('__domain');
        if (hostParam === 'supplier') return { type: 'supplier', region: 'GLOBAL' };
        if (hostParam === 'ng') return { type: 'regional', region: 'NG' };
        if (hostParam === 'bd') return { type: 'regional', region: 'BD' };
        if (hostParam === 'admin') return { type: 'admin' };
        if (hostParam === 'ops') return { type: 'ops' };
    }

    // Default to main domain
    return { type: 'main', region: 'GLOBAL' };
}

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const host = req.headers.get('host') || '';
    let domainInfo = getDomainInfo(host);

    // Local dev convenience: allow path prefixes to simulate subdomains when running on localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        const p = url.pathname.toLowerCase();
        if (p.startsWith('/supplier')) domainInfo = { type: 'supplier', region: 'GLOBAL' };
        else if (p.startsWith('/ng')) domainInfo = { type: 'regional', region: 'NG' };
        else if (p.startsWith('/bd')) domainInfo = { type: 'regional', region: 'BD' };
        else if (p.startsWith('/admin')) domainInfo = { type: 'admin' };
        else if (p.startsWith('/ops')) domainInfo = { type: 'ops' };
    }

    // Add domain info to headers for use in pages/components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-domain-type', domainInfo.type);
    requestHeaders.set('x-region', domainInfo.region || 'GLOBAL');

    // 1. SUPPLIER SUBDOMAIN
    if (domainInfo.type === 'supplier') {
        // If not already under /supplier, rewrite to /supplier
        if (!url.pathname.startsWith('/supplier')) {
            // Preserve auth pages
            if (url.pathname.startsWith('/auth')) {
                return NextResponse.next({ request: { headers: requestHeaders } });
            }
            // Rewrite home to supplier
            if (url.pathname === '/') {
                url.pathname = '/supplier';
                return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
            }
            // Rewrite other paths
            url.pathname = `/supplier${url.pathname}`;
            return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
        }
    }

    // 2. ADMIN SUBDOMAIN
    if (domainInfo.type === 'admin') {
        if (!url.pathname.startsWith('/admin')) {
            if (url.pathname === '/') {
                url.pathname = '/admin';
            } else {
                url.pathname = `/admin${url.pathname}`;
            }
            return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
        }
    }

    // 3. OPS SUBDOMAIN
    if (domainInfo.type === 'ops') {
        if (!url.pathname.startsWith('/ops')) {
            if (url.pathname === '/') {
                url.pathname = '/ops';
            } else {
                url.pathname = `/ops${url.pathname}`;
            }
            return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
        }
    }

    // 4. REGIONAL SUBDOMAINS (NG, BD)
    if (domainInfo.type === 'regional') {
        // For regional hosts, route users to the marketplace but set region header.
        // If request is not already under /marketplace, rewrite and preserve original path as subpath.
        if (!url.pathname.startsWith('/marketplace')) {
            // If root, rewrite to /marketplace
            if (url.pathname === '/') {
                url.pathname = '/marketplace';
            } else {
                // Preserve sub-paths under marketplace: e.g. ng.banadama.com/products -> /marketplace/products
                url.pathname = `/marketplace${url.pathname}`;
            }
            return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
        }
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
}
