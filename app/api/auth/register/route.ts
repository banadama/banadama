// app/api/auth/register/route.ts

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, role, country, profileData } = body;

        // Validation
        if (!email || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields: email, password, role" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles: Role[] = ["BUYER", "SUPPLIER", "CREATOR", "AFFILIATE"];
        if (!validRoles.includes(role as Role)) {
            return NextResponse.json(
                { error: "Invalid role. Must be BUYER, SUPPLIER, CREATOR, or AFFILIATE" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and profile in transaction
        const result = await db.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    role: role as Role,
                    country: country || null,
                    isActive: true,
                },
            });

            // Create role-specific profile
            if (role === "BUYER") {
                await tx.buyerProfile.create({
                    data: {
                        userId: user.id,
                        companyName: profileData?.companyName,
                        phoneNumber: profileData?.phoneNumber,
                        defaultAddress: profileData?.address,
                        defaultCity: profileData?.city,
                        defaultCountry: country || "NG",
                    },
                });
            } else if (role === "SUPPLIER") {
                await tx.supplierProfile.create({
                    data: {
                        userId: user.id,
                        businessName: profileData?.businessName,
                        type: profileData?.type || "FACTORY",
                        phoneNumber: profileData?.phoneNumber,
                        address: profileData?.address,
                        city: profileData?.city,
                        isVerified: false,
                    },
                });
            } else if (role === "CREATOR") {
                await tx.creatorProfile.create({
                    data: {
                        userId: user.id,
                        displayName: profileData?.displayName,
                        creatorType: profileData?.creatorType || "GRAPHIC_DESIGNER",
                        bio: profileData?.bio,
                        isVerified: false,
                    },
                });
            } else if (role === "AFFILIATE") {
                await tx.affiliateProfile.create({
                    data: {
                        userId: user.id,
                        displayName: profileData?.displayName,
                        bio: profileData?.bio,
                    },
                });
            }

            // Create wallet
            await tx.wallet.create({
                data: {
                    userId: user.id,
                    balance: 0,
                    lockedBalance: 0,
                    currency: "NGN",
                    status: "ACTIVE",
                },
            });

            // Store hashed password (if you have a password field, otherwise use Supabase)
            // This implementation assumes you're using Supabase for auth
            // If using custom auth, add a Password model

            return user;
        });

        // Set JWT session
        await setSession({
            id: result.id,
            email: result.email,
            role: result.role,
            country: result.country,
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: result.id,
                    email: result.email,
                    role: result.role,
                    country: result.country,
                },
                message: "Registration successful",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}
