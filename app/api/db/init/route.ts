import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

// Initialize database tables - GET request, no auth required for first-time setup
export async function GET() {
  try {
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Also support POST for backwards compatibility
export async function POST() {
  return GET();
}
