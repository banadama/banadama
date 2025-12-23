import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Sign-out logic - will integrate with Supabase

        return NextResponse.json({
            success: true,
            message: 'Signed out successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Sign-out failed' },
            { status: 500 }
        );
    }
}
