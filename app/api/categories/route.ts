import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { Category } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'categories.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readCategories(): Promise<Category[]> {
  try {
    await ensureDataDir();
    const encryptedData = await fs.readFile(DATA_FILE, 'utf-8');
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch {
    return [];
  }
}

async function writeCategories(categories: Category[]) {
  await ensureDataDir();
  const data = JSON.stringify(categories);
  const encryptedData = encrypt(data);
  await fs.writeFile(DATA_FILE, encryptedData, 'utf-8');
}

export async function GET() {
  try {
    await requireAuth();
    const categories = await readCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/categories - Starting auth check');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    await requireAuth();
    console.log('POST /api/categories - Auth successful');
    
    const body = await request.json();
    const { name, description, color, icon } = body;

    console.log('POST body:', { name, description, color, icon });

    const categories = await readCategories();
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      description,
      color: '#E97451', // Always use orange accent color
      icon: icon || '📝',
      todos: [],
      createdAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    await writeCategories(categories);

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
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const categories = await readCategories();
    const filtered = categories.filter(cat => cat.id !== id);
    await writeCategories(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
