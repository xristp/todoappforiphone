import { createClient } from '@vercel/postgres';

// Create client for pooled connections (works in both dev and production)
const client = createClient({
  connectionString: process.env.POSTGRES_URL,
});

await client.connect();

// Initialize database tables
export async function initDatabase() {
  try {
    // Create users table
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        color VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create todos table
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(50) PRIMARY KEY,
        category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        notes TEXT,
        due_date VARCHAR(50),
        priority VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_todos_user ON todos(user_email)`;

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
    await sql`
      INSERT INTO users (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;
    return { success: true };
  } catch (error) {
    console.error('Error ensuring user:', error);
    throw error;
  }
}

// Get all categories for a user
export async function getCategories(userEmail: string) {
  const { rows } = await sql`
    SELECT id, name, icon, color, created_at, updated_at
    FROM categories
    WHERE user_email = ${userEmail}
    ORDER BY created_at ASC
  `;
  return rows;
}

// Create a category
export async function createCategory(userEmail: string, category: any) {
  await sql`
    INSERT INTO categories (id, user_email, name, icon, color)
    VALUES (${category.id}, ${userEmail}, ${category.name}, ${category.icon}, ${category.color})
  `;
  return category;
}

// Update a category
export async function updateCategory(userEmail: string, categoryId: string, updates: any) {
  await sql`
    UPDATE categories
    SET name = ${updates.name},
        icon = ${updates.icon},
        color = ${updates.color},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${categoryId} AND user_email = ${userEmail}
  `;
}

// Delete a category
export async function deleteCategory(userEmail: string, categoryId: string) {
  await sql`
    DELETE FROM categories
    WHERE id = ${categoryId} AND user_email = ${userEmail}
  `;
}

// Get all todos for a category
export async function getTodos(userEmail: string, categoryId: string) {
  const { rows } = await sql`
    SELECT id, category_id, title, completed, notes, due_date, priority, created_at, updated_at
    FROM todos
    WHERE category_id = ${categoryId} AND user_email = ${userEmail}
    ORDER BY created_at DESC
  `;
  return rows;
}

// Create a todo
export async function createTodo(userEmail: string, categoryId: string, todo: any) {
  await sql`
    INSERT INTO todos (id, category_id, user_email, title, completed, notes, due_date, priority)
    VALUES (
      ${todo.id},
      ${categoryId},
      ${userEmail},
      ${todo.title},
      ${todo.completed || false},
      ${todo.notes || null},
      ${todo.dueDate || null},
      ${todo.priority || null}
    )
  `;
  return todo;
}

// Update a todo
export async function updateTodo(userEmail: string, todoId: string, updates: any) {
  const sets = [];
  const values = [];

  if (updates.title !== undefined) {
    sets.push('title');
    values.push(updates.title);
  }
  if (updates.completed !== undefined) {
    sets.push('completed');
    values.push(updates.completed);
  }
  if (updates.notes !== undefined) {
    sets.push('notes');
    values.push(updates.notes);
  }
  if (updates.dueDate !== undefined) {
    sets.push('due_date');
    values.push(updates.dueDate);
  }
  if (updates.priority !== undefined) {
    sets.push('priority');
    values.push(updates.priority);
  }

  if (sets.length === 0) return;

  // Build the SET clause dynamically
  const setClause = sets.map((col, i) => `${col} = $${i + 1}`).join(', ');
  
  await sql.query(
    `UPDATE todos SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${sets.length + 1} AND user_email = $${sets.length + 2}`,
    [...values, todoId, userEmail]
  );
}

// Delete a todo
export async function deleteTodo(userEmail: string, todoId: string) {
  await sql`
    DELETE FROM todos
    WHERE id = ${todoId} AND user_email = ${userEmail}
  `;
}
