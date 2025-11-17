import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getTodos, createTodo, updateTodo, deleteTodo, ensureUser } from '@/lib/db';

// GET all todos for a category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await ensureUser(email);
    const todos = await getTodos(email, categoryId);

    return NextResponse.json(todos);
  } catch (error) {
    console.error('GET /api/categories/[categoryId]/todos error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { title, notes, dueDate, priority, email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await ensureUser(email);

    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      notes: notes || null,
      dueDate: dueDate || null,
      priority: priority || null,
    };

    await createTodo(email, categoryId, newTodo);

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('POST /api/categories/[categoryId]/todos error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { todoId, completed, title, notes, dueDate, priority, email } = await request.json();

    if (!todoId || !email) {
      return NextResponse.json({ error: 'Todo ID and email required' }, { status: 400 });
    }

    const updates: any = {};
    if (completed !== undefined) updates.completed = completed;
    if (title !== undefined) updates.title = title;
    if (notes !== undefined) updates.notes = notes;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;

    await updateTodo(email, todoId, updates);

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error('PATCH /api/categories/[categoryId]/todos error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);
    const todoId = searchParams.get('todoId');
    const email = searchParams.get('email');

    if (!todoId || !email) {
      return NextResponse.json({ error: 'Todo ID and email required' }, { status: 400 });
    }

    await deleteTodo(email, todoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[categoryId]/todos error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
