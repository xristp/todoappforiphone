import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// Initialize database tables
export async function POST() {
  try {
    // Only allow authenticated admin users to init database
    await requireAuth();
    
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
