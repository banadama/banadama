// __tests__/lib/auth.test.ts
// Comprehensive tests for authentication system

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import {
    setSession,
    getCurrentUser,
    clearSession,
    requireRole,
    requireAuth,
    hasRole,
    getRoleDashboard,
    isPublicRoute,
    getAllowedRoutesForRole,
} from "@/lib/auth";
import { db } from "@/lib/db";
import type { AuthUser } from "@/lib/auth";
import type { Role } from "@prisma/client";

// Mock dependencies
jest.mock("next/headers");
jest.mock("next/navigation");
jest.mock("@/lib/db");

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockDb = db as jest.Mocked<typeof db>;

// Test data
const testUser: AuthUser = {
    id: "user-123",
    email: "test@example.com",
    role: "BUYER" as Role,
    country: "NG",
};

const JWT_SECRET = new TextEncoder().encode("test-secret-key");

describe("Auth System", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ============================================
    // setSession() Tests
    // ============================================

    describe("setSession", () => {
        it("should create JWT and set httpOnly cookie", async () => {
            const mockCookieStore = {
                set: jest.fn(),
                get: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            const token = await setSession(testUser);

            expect(token).toBeTruthy();
            expect(typeof token).toBe("string");
            expect(mockCookieStore.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "banadama-session",
                    value: expect.any(String),
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/",
                })
            );
        });

        it("should include user data in JWT payload", async () => {
            const mockCookieStore = {
                set: jest.fn(),
                get: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            const token = await setSession(testUser);

            // Decode JWT (without verification for testing)
            const payload = JSON.parse(
                Buffer.from(token.split(".")[1], "base64").toString()
            );

            expect(payload.userId).toBe(testUser.id);
            expect(payload.email).toBe(testUser.email);
            expect(payload.role).toBe(testUser.role);
            expect(payload.country).toBe(testUser.country);
            expect(payload.exp).toBeTruthy();
        });

        it("should throw error on failure", async () => {
            mockCookies.mockRejectedValue(new Error("Cookie error"));

            await expect(setSession(testUser)).rejects.toThrow(
                "Failed to create session"
            );
        });
    });

    // ============================================
    // getCurrentUser() Tests
    // ============================================

    describe("getCurrentUser", () => {
        it("should return user from valid JWT", async () => {
            // Create valid JWT
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: testUser.role,
                country: testUser.country,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            mockDb.user.findUnique = jest.fn().mockResolvedValue({
                id: testUser.id,
                email: testUser.email,
                role: testUser.role,
                country: testUser.country,
                isActive: true,
            });

            const user = await getCurrentUser();

            expect(user).toEqual(testUser);
            expect(mockDb.user.findUnique).toHaveBeenCalledWith({
                where: { id: testUser.id },
                select: expect.any(Object),
            });
        });

        it("should return null if no token", async () => {
            const mockCookieStore = {
                get: jest.fn().mockReturnValue(undefined),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            const user = await getCurrentUser();

            expect(user).toBeNull();
        });

        it("should return null if user is inactive", async () => {
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: testUser.role,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            mockDb.user.findUnique = jest.fn().mockResolvedValue({
                id: testUser.id,
                email: testUser.email,
                role: testUser.role,
                isActive: false, // User is deactivated
            });

            const user = await getCurrentUser();

            expect(user).toBeNull();
        });

        it("should return null if JWT is expired", async () => {
            // Create expired JWT
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: testUser.role,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("0s") // Already expired
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            const user = await getCurrentUser();

            expect(user).toBeNull();
        });
    });

    // ============================================
    // requireRole() Tests
    // ============================================

    describe("requireRole", () => {
        it("should allow user with correct role", async () => {
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: "BUYER",
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            mockDb.user.findUnique = jest.fn().mockResolvedValue({
                id: testUser.id,
                email: testUser.email,
                role: "BUYER",
                isActive: true,
            });

            const user = await requireRole("BUYER");

            expect(user.role).toBe("BUYER");
            expect(mockRedirect).not.toHaveBeenCalled();
        });

        it("should allow user with one of multiple roles", async () => {
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: "OPS",
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            mockDb.user.findUnique = jest.fn().mockResolvedValue({
                id: testUser.id,
                email: testUser.email,
                role: "OPS",
                isActive: true,
            });

            const user = await requireRole(["ADMIN", "OPS"] as Role[]);

            expect(user.role).toBe("OPS");
            expect(mockRedirect).not.toHaveBeenCalled();
        });

        it("should redirect to login if not authenticated", async () => {
            const mockCookieStore = {
                get: jest.fn().mockReturnValue(undefined),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            await expect(requireRole("BUYER")).rejects.toThrow();

            expect(mockRedirect).toHaveBeenCalledWith("/auth/login");
        });

        it("should redirect to forbidden if wrong role", async () => {
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: "BUYER",
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            mockDb.user.findUnique = jest.fn().mockResolvedValue({
                id: testUser.id,
                email: testUser.email,
                role: "BUYER",
                isActive: true,
            });

            await expect(requireRole("ADMIN")).rejects.toThrow();

            expect(mockRedirect).toHaveBeenCalledWith("/auth/forbidden");
        });

        it("should normalize FACTORY role to SUPPLIER", async () => {
            const token = await new SignJWT({
                userId: testUser.id,
                email: testUser.email,
                role: "FACTORY",
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

            const mockCookieStore = {
                get: jest.fn().mockReturnValue({ value: token }),
                set: jest.fn(),
                delete: jest.fn(),
            };

            mockCookies.mockResolvedValue(mockCookieStore as any);

            mockDb.user.findUnique = jest.fn().mockResolvedValue({
                id: testUser.id,
                email: testUser.email,
                role: "FACTORY",
                isActive: true,
            });

            const user = await requireRole("SUPPLIER");

            expect(user).toBeTruthy();
            expect(mockRedirect).not.toHaveBeenCalled();
        });
    });

    // ============================================
    // Utility Functions Tests
    // ============================================

    describe("hasRole", () => {
        it("should return true if user has role", () => {
            expect(hasRole(testUser, "BUYER")).toBe(true);
        });

        it("should return true if user has one of multiple roles", () => {
            expect(hasRole(testUser, ["ADMIN", "BUYER"] as Role[])).toBe(true);
        });

        it("should return false if user doesn't have role", () => {
            expect(hasRole(testUser, "ADMIN")).toBe(false);
        });

        it("should return false if user is null", () => {
            expect(hasRole(null, "BUYER")).toBe(false);
        });
    });

    describe("getRoleDashboard", () => {
        it("should return correct dashboard for each role", () => {
            // SPEC: Buyers have NO dashboard - redirect to marketplace
            expect(getRoleDashboard("BUYER" as Role)).toBe("/marketplace");
            expect(getRoleDashboard("SUPPLIER" as Role)).toBe("/supplier/dashboard");
            // SPEC: Creators and Affiliates use unified supplier domain
            expect(getRoleDashboard("CREATOR" as Role)).toBe("/supplier/dashboard");
            expect(getRoleDashboard("OPS" as Role)).toBe("/ops/dashboard");
            expect(getRoleDashboard("ADMIN" as Role)).toBe("/admin/dashboard");
            expect(getRoleDashboard("AFFILIATE" as Role)).toBe(
                "/supplier/dashboard"
            );
        });

        it("should normalize legacy roles", () => {
            expect(getRoleDashboard("FACTORY" as Role)).toBe("/supplier/dashboard");
            expect(getRoleDashboard("WHOLESALER" as Role)).toBe(
                "/supplier/dashboard"
            );
        });
    });

    describe("isPublicRoute", () => {
        it("should return true for public routes", () => {
            expect(isPublicRoute("/")).toBe(true);
            expect(isPublicRoute("/auth/login")).toBe(true);
            expect(isPublicRoute("/marketplace")).toBe(true);
            expect(isPublicRoute("/buy-near-me")).toBe(true);
        });

        it("should return false for protected routes", () => {
            expect(isPublicRoute("/buyer/dashboard")).toBe(false);
            expect(isPublicRoute("/admin/users")).toBe(false);
            expect(isPublicRoute("/ops/rfqs")).toBe(false);
        });
    });

    describe("getAllowedRoutesForRole", () => {
        it("should return correct routes for each role", () => {
            expect(getAllowedRoutesForRole("BUYER" as Role)).toEqual(["/buyer"]);
            expect(getAllowedRoutesForRole("SUPPLIER" as Role)).toEqual([
                "/supplier",
            ]);
            expect(getAllowedRoutesForRole("ADMIN" as Role)).toEqual([
                "/admin",
                "/ops",
            ]);
        });
    });
});
