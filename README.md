# iPhone-Style Todo App

A beautiful, modern todo application with iPhone design aesthetics built with Next.js, TypeScript, and Framer Motion.

## Features

- 🔐 **Secure Authentication** - Single-user login with encrypted credentials
- 📝 **Category Management** - Organize todos into custom categories with icons and colors
- ✅ **Todo Tasks** - Add, complete, and delete tasks within categories
- 🎨 **Beautiful UI** - iPhone-inspired design with glass morphism effects
- ✨ **Smooth Animations** - Framer Motion animations throughout
- 🔒 **Encrypted Storage** - All data is encrypted at rest

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
USER_EMAIL=admin@todo.app
USER_PASSWORD_HASH=your-bcrypt-hash-here
```

### 3. Generate Password Hash

Run the password generator script:

```bash
node scripts/generate-password.js
```

Copy the generated hash to your `.env.local` file as `USER_PASSWORD_HASH`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **bcryptjs** - Password hashing
- **jose** - JWT tokens
- **lucide-react** - Icons

## Security Features

- Bcrypt password hashing
- JWT authentication with HTTP-only cookies
- AES-256 encryption for stored data
- Single-user authentication
- Secure session management

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── categories/    # Category and todo endpoints
│   ├── dashboard/         # Main app dashboard
│   ├── layout.tsx
│   └── page.tsx          # Login page
├── components/           # Reusable UI components
├── lib/                 # Utility functions
├── types/              # TypeScript type definitions
└── data/              # Encrypted data storage
```

## Usage

1. **Login** - Use your configured email and password
2. **Create Categories** - Click "Add Category" to create new categories with custom icons and colors
3. **Add Todos** - Click on a category to open it and add todo tasks
4. **Complete Tasks** - Click the checkbox to mark tasks as complete
5. **Delete Items** - Hover over items to reveal delete buttons

## Customization

### Colors

Edit the `COLOR_OPTIONS` array in `app/dashboard/page.tsx` to customize available colors.

### Icons

Edit the `EMOJI_OPTIONS` array in `app/dashboard/page.tsx` to customize available emojis.

### Styling

Modify `app/globals.css` and `tailwind.config.ts` for custom styling.

## License

MIT

---

Made with ❤️ using Next.js
