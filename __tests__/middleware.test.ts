// __tests__/middleware.test.ts
// Tests for global authentication middleware

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { middleware } from "../middleware";

const JWT_SECRET = new TextEncoder().encode("test-secret-key");

describe("Middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper to create mock request
    function createMockRequest(
        pathname: string,
        token?: string
    ): NextRequest {
        const url = `https://example.com${pathname}`;
        const request = new NextRequest(url);

        if (token) {
            request.cookies.set("banadama-session", token);
        }

        return request;
    }

    // Helper to create valid JWT
    async function createToken(role: string): Promise<string> {
        return await new SignJWT({
            userId: "user-123",
            email: "test@example.com",
            role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(JWT_SECRET);
    }

    // ============================================
    // Public Routes Tests
    // ============================================

    describe("Public Routes", () => {
        it("should allow access to homepage", async () => {
            const request = createMockRequest("/");
            const response = await middleware(request);

            expect(response.status).not.toBe(307); // Not a redirect
        });

        it("should allow access to login page", async () => {
            const request = createMockRequest("/auth/login");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow access to marketplace", async () => {
            const request = createMockRequest("/marketplace");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow access to creators page", async () => {
            const request = createMockRequest("/creators");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });
    });

    // ============================================
    // Protected Routes Tests
    // ============================================

    describe("Protected Routes", () => {
        it("should redirect to login if no token", async () => {
            const request = createMockRequest("/buyer/dashboard");
            const response = await middleware(request);

            expect(response.status).toBe(307); // Redirect
            expect(response.headers.get("location")).toContain("/auth/login");
        });

        it("should redirect to login with redirect parameter", async () => {
            const request = createMockRequest("/buyer/orders");
            const response = await middleware(request);

            expect(response.status).toBe(307);
            const location = response.headers.get("location");
            expect(location).toContain("/auth/login");
            expect(location).toContain("redirect=%2Fbuyer%2Forders");
        });
    });

    // ============================================
    // Role-Based Access Tests
    // ============================================

    describe("Role-Based Access", () => {
        it("should allow BUYER to access /buyer routes", async () => {
            const token = await createToken("BUYER");
            const request = createMockRequest("/buyer/dashboard", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
            expect(response.status).not.toBe(403);
        });

        it("should deny BUYER access to /admin routes", async () => {
            const token = await createToken("BUYER");
            const request = createMockRequest("/admin/users", token);
            const response = await middleware(request);

            expect(response.status).toBe(307);
            expect(response.headers.get("location")).toContain("/auth/forbidden");
        });

        it("should allow SUPPLIER to access /supplier routes", async () => {
            const token = await createToken("SUPPLIER");
            const request = createMockRequest("/supplier/products", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow FACTORY to access /supplier routes", async () => {
            const token = await createToken("FACTORY");
            const request = createMockRequest("/supplier/orders", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow OPS to access /ops routes", async () => {
            const token = await createToken("OPS");
            const request = createMockRequest("/ops/dashboard", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow ADMIN to access /admin routes", async () => {
            const token = await createToken("ADMIN");
            const request = createMockRequest("/admin/users", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow ADMIN to access /ops routes", async () => {
            const token = await createToken("ADMIN");
            const request = createMockRequest("/ops/rfqs", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow CREATOR to access /creator routes", async () => {
            const token = await createToken("CREATOR");
            const request = createMockRequest("/creator/products", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow AFFILIATE to access /affiliate routes", async () => {
            const token = await createToken("AFFILIATE");
            const request = createMockRequest("/affiliate/dashboard", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });
    });

    // ============================================
    // Legacy Role Support Tests
    // ============================================

    describe("Legacy Role Support", () => {
        it("should allow FACTORY to access /factory routes", async () => {
            const token = await createToken("FACTORY");
            const request = createMockRequest("/factory/dashboard", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should allow WHOLESALER to access /wholesaler routes", async () => {
            const token = await createToken("WHOLESALER");
            const request = createMockRequest("/wholesaler/products", token);
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });
    });

    // ============================================
    // JWT Validation Tests
    // ============================================

    describe("JWT Validation", () => {
        it("should reject invalid JWT", async () => {
            const request = createMockRequest(
                "/buyer/dashboard",
                "invalid-jwt-token"
            );
            const response = await middleware(request);

            expect(response.status).toBe(307);
            expect(response.headers.get("location")).toContain("/auth/login");
        });

        it("should reject expired JWT", async () => {
            const expiredToken = await new SignJWT({
                userId: "user-123",
                email: "test@example.com",
                role: "BUYER",
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("0s") // Expired immediately
                .sign(JWT_SECRET);

            const request = createMockRequest("/buyer/dashboard", expiredToken);
            const response = await middleware(request);

            expect(response.status).toBe(307);
            expect(response.headers.get("location")).toContain("/auth/login");
        });

        it("should delete cookie on invalid JWT", async () => {
            const request = createMockRequest(
                "/buyer/dashboard",
                "invalid-jwt-token"
            );
            const response = await middleware(request);

            // Check if cookie is deleted (should have Set-Cookie header)
            const setCookie = response.headers.get("set-cookie");
            expect(setCookie).toBeTruthy();
            expect(setCookie).toContain("banadama-session=");
        });
    });

    // ============================================
    // Ignored Paths Tests
    // ============================================

    describe("Ignored Paths", () => {
        it("should skip middleware for _next paths", async () => {
            const request = createMockRequest("/_next/static/file.js");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should skip middleware for favicon", async () => {
            const request = createMockRequest("/favicon.ico");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should skip middleware for auth API", async () => {
            const request = createMockRequest("/api/auth/login");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });

        it("should skip middleware for webhooks", async () => {
            const request = createMockRequest("/api/webhook/paystack");
            const response = await middleware(request);

            expect(response.status).not.toBe(307);
        });
    });

    // ============================================
    // User Headers Tests
    // ============================================

    describe("User Headers", () => {
        it("should add user info to response headers", async () => {
            const token = await createToken("BUYER");
            const request = createMockRequest("/buyer/dashboard", token);
            const response = await middleware(request);

            expect(response.headers.get("x-user-id")).toBe("user-123");
            expect(response.headers.get("x-user-role")).toBe("BUYER");
            expect(response.headers.get("x-user-email")).toBe("test@example.com");
        });
    });
});
