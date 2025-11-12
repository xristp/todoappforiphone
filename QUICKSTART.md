# 🚀 Quick Start Guide

## Your App is Ready!

Your iPhone-style todo app is now running at: **http://localhost:3000**

## 🔐 Login Credentials

- **Email**: `admin@todo.app`
- **Password**: `your-password-here`

## ✨ Features

### 🎨 Beautiful iPhone-Style UI
- Glass morphism effects with backdrop blur
- Smooth Framer Motion animations
- Clean, modern design inspired by iOS

### 📁 Category Management
- Create unlimited categories
- Choose from 10 emojis: 📝 💼 🏠 🎯 💪 📚 🎨 🛒 ✈️ ❤️
- Pick from 8 colors: Blue, Red, Green, Orange, Purple, Pink, etc.
- Track progress with visual progress bars

### ✅ Todo Tasks
- Add unlimited todos to each category
- Check/uncheck tasks with smooth animations
- Delete tasks with hover actions
- See completion statistics

### 🔒 Security
- Bcrypt password hashing
- JWT authentication with HTTP-only cookies
- AES-256 encrypted data storage
- Single-user authentication

## 📝 How to Use

### 1. Login
Navigate to http://localhost:3000 and enter your credentials.

### 2. Create a Category
- Click "Add Category" button
- Enter a category name (e.g., "Work", "Personal", "Shopping")
- Choose an emoji icon
- Pick a color
- Click "Create Category"

### 3. Add Todos
- Click on any category card
- A modal will open
- Type your todo in the input field
- Press Enter or click the + button
- Your todo is added!

### 4. Complete Tasks
- Click the circle checkbox next to any todo
- It will animate and show a checkmark
- The text will get a line-through

### 5. Delete Items
- Hover over a todo or category
- A delete button (trash icon) will appear
- Click it to remove the item

## 🎨 Customization

### Change Password
1. Open `scripts/generate-password.js`
2. Change the password on line 4
3. Run: `node scripts/generate-password.js`
4. Copy the hash to `.env.local` as `USER_PASSWORD_HASH`
5. Restart the server

### Change Email
Edit `USER_EMAIL` in `.env.local`

### Add More Emojis
Edit `EMOJI_OPTIONS` array in `app/dashboard/page.tsx`

### Add More Colors
Edit `COLOR_OPTIONS` array in `app/dashboard/page.tsx`

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate new password hash
node scripts/generate-password.js
```

## 📱 Recommended Browser

For the best experience, use:
- Chrome
- Safari
- Edge
- Firefox (latest version)

The app works great on mobile devices too!

## 🌟 Tips

1. **Categories are flexible** - Use them for projects, areas of life, or any way you organize tasks
2. **Visual feedback** - Pay attention to the smooth animations - they make the app feel alive
3. **Keyboard shortcuts** - Press Enter in any input to submit quickly
4. **Hover actions** - Many actions appear on hover to keep the UI clean

## 🔧 Troubleshooting

### Can't login?
- Check your `.env.local` file has the correct `USER_PASSWORD_HASH`
- Make sure the email matches `USER_EMAIL` in `.env.local`
- Try regenerating the password hash

### Styles not loading?
- Run `npm install` again
- Clear your browser cache
- Restart the dev server

### Port already in use?
- Kill the process on port 3000
- Or run: `npm run dev -- -p 3001` to use a different port

## 📦 Production Deployment

### Before deploying:

1. **Change JWT Secret**
   ```env
   JWT_SECRET=<generate-a-secure-random-string>
   ```

2. **Change Encryption Key**
   ```env
   ENCRYPTION_KEY=<generate-a-64-character-hex-string>
   ```

3. **Update Password**
   Generate a new password hash and update `.env.local`

4. **Build the app**
   ```bash
   npm run build
   ```

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard
4. Done!

## 🎉 Enjoy Your App!

You now have a fully functional, beautiful todo app with enterprise-grade security and smooth animations. Make it your own and stay productive! 

---

**Need help?** Check the main README.md or the code comments for more details.
