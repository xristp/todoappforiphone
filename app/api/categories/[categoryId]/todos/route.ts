import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { Category, Todo } from '@/types';

// Use /tmp in production (Vercel), local data directory in development
const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp/data'
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'categories.json');

async function readCategories(): Promise<Category[]> {
  try {
    const encryptedData = await fs.readFile(DATA_FILE, 'utf-8');
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch {
    return [];
  }
}

async function writeCategories(categories: Category[]) {
  const data = JSON.stringify(categories);
  const encryptedData = encrypt(data);
  await fs.writeFile(DATA_FILE, encryptedData, 'utf-8');
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await requireAuth();
    const { categoryId } = await params;
    const { text, notes, dueDate, dueTime, assignedTo } = await request.json();

    const categories = await readCategories();
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      assignedTo: assignedTo || undefined,
      archived: false,
      order: category.todos.length,
    };

    category.todos.push(newTodo);
    await writeCategories(categories);

    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await requireAuth();
    const { categoryId } = await params;
    const { todoId, completed, text, archived } = await request.json();

    const categories = await readCategories();
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const todo = category.todos.find(t => t.id === todoId);
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    if (completed !== undefined) todo.completed = completed;
    if (text !== undefined) todo.text = text;
    if (archived !== undefined) todo.archived = archived;
    
    await writeCategories(categories);

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await requireAuth();
    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);
    const todoId = searchParams.get('todoId');

    if (!todoId) {
      return NextResponse.json({ error: 'Todo ID required' }, { status: 400 });
    }

    const categories = await readCategories();
    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    category.todos = category.todos.filter(t => t.id !== todoId);
    await writeCategories(categories);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
