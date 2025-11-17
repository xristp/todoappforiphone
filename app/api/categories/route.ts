import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCategories, createCategory, deleteCategory, ensureUser } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get email from query params (sent by client after Firebase auth)
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    await ensureUser(userEmail);
    const categories = await getCategories(userEmail);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, email } = body;
    
    console.log('POST /api/categories - received:', { name, icon, email });
    
    if (!email) {
      console.error('Missing email in request');
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('Ensuring user exists:', email);
    await ensureUser(email);

    const newCategory = {
      id: crypto.randomUUID(),
      name,
      color: '#E97451',
      icon: icon || '📝',
    };

    console.log('Creating category:', newCategory);
    await createCategory(email, newCategory);

    console.log('POST /api/categories - Category created:', newCategory.name, 'for', email);
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('POST /api/categories error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id || !email) {
      return NextResponse.json({ error: 'Category ID and email required' }, { status: 400 });
    }

    await deleteCategory(email, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
