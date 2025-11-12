import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCategories, createCategory, deleteCategory, ensureUser } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();
    const userEmail = session.email as string;
    
    await ensureUser(userEmail);
    const categories = await getCategories(userEmail);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/categories - Starting auth check');
    
    const session = await requireAuth();
    const userEmail = session.email as string;
    console.log('POST /api/categories - Auth successful');
    
    await ensureUser(userEmail);
    
    const body = await request.json();
    const { name, icon } = body;

    console.log('POST body:', { name, icon });

    const newCategory = {
      id: crypto.randomUUID(),
      name,
      color: '#E97451', // Always use orange accent color
      icon: icon || '📝',
    };

    await createCategory(userEmail, newCategory);

    console.log('POST /api/categories - Category created:', newCategory.name);
    return NextResponse.json(newCategory);
  } catch (error) {
    console.log('POST /api/categories - Auth failed:', error);
    console.log('Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireAuth();
    const userEmail = session.email as string;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    await deleteCategory(userEmail, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
