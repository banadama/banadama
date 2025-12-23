import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Sign-in logic - will integrate with Supabase

        return NextResponse.json({
            success: true,
            message: 'Signed in successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Sign-in failed' },
            { status: 401 }
        );
    }
}
