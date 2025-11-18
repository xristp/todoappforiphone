import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('todoapp');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Initialize database (create indexes)
export async function initDatabase() {
  try {
    const { db } = await connectToDatabase();
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('categories').createIndex({ user_email: 1 });
    await db.collection('todos').createIndex({ category_id: 1 });
    await db.collection('todos').createIndex({ user_email: 1 });

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Ensure user exists in database
export async function ensureUser(email: string) {
  try {
    const { db } = await connectToDatabase();
    await db.collection('users').updateOne(
      { email },
      { $setOnInsert: { email, created_at: new Date() } },
      { upsert: true }
    );
    return { success: true };
  } catch (error) {
    console.error('Error ensuring user:', error);
    throw error;
  }
}

// Get all categories for a user
export async function getCategories(userEmail: string) {
  const { db } = await connectToDatabase();
  const categories = await db.collection('categories')
    .find({ user_email: userEmail })
    .sort({ created_at: 1 })
    .toArray();
  return categories;
}

// Create a category
export async function createCategory(userEmail: string, category: any) {
  const { db } = await connectToDatabase();
  await db.collection('categories').insertOne({
    ...category,
    user_email: userEmail,
    created_at: new Date(),
    updated_at: new Date()
  });
  return category;
}

// Update a category
export async function updateCategory(userEmail: string, categoryId: string, updates: any) {
  const { db } = await connectToDatabase();
  await db.collection('categories').updateOne(
    { id: categoryId, user_email: userEmail },
    { $set: { ...updates, updated_at: new Date() } }
  );
}

// Delete a category
export async function deleteCategory(userEmail: string, categoryId: string) {
  const { db } = await connectToDatabase();
  await db.collection('categories').deleteOne({ id: categoryId, user_email: userEmail });
  await db.collection('todos').deleteMany({ category_id: categoryId, user_email: userEmail });
}

// Get all todos for a category
export async function getTodos(userEmail: string, categoryId: string) {
  const { db } = await connectToDatabase();
  const todos = await db.collection('todos')
    .find({ category_id: categoryId, user_email: userEmail })
    .sort({ created_at: -1 })
    .toArray();
  return todos;
}

// Create a todo
export async function createTodo(userEmail: string, categoryId: string, todo: any) {
  const { db } = await connectToDatabase();
  await db.collection('todos').insertOne({
    ...todo,
    category_id: categoryId,
    user_email: userEmail,
    completed: todo.completed || false,
    created_at: new Date(),
    updated_at: new Date()
  });
  return todo;
}

// Update a todo
export async function updateTodo(userEmail: string, todoId: string, updates: any) {
  const { db } = await connectToDatabase();
  
  const updateData: any = { updated_at: new Date() };
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.completed !== undefined) updateData.completed = updates.completed;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
  if (updates.dueTime !== undefined) updateData.dueTime = updates.dueTime;
  if (updates.assignedTo !== undefined) updateData.assignedTo = updates.assignedTo;
  if (updates.priority !== undefined) updateData.priority = updates.priority;

  await db.collection('todos').updateOne(
    { id: todoId, user_email: userEmail },
    { $set: updateData }
  );
}

// Delete a todo
export async function deleteTodo(userEmail: string, todoId: string) {
  const { db } = await connectToDatabase();
  await db.collection('todos').deleteOne({ id: todoId, user_email: userEmail });
}
