# TinyLink Frontend

Modern, responsive URL shortener frontend built with React, Vite, and Tailwind CSS.

## 🚀 Features

- ✅ Clean, modern UI with Tailwind CSS
- ✅ Create short links with custom codes
- ✅ Real-time search and filtering
- ✅ Click statistics dashboard
- ✅ Copy to clipboard functionality
- ✅ Responsive design (mobile-friendly)
- ✅ Loading states and error handling
- ✅ Form validation with inline errors
- ✅ Empty states for better UX
- ✅ Success/error notifications

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Running backend API (see backend README)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tinylink-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your backend URLs:

```env
VITE_API_URL=http://localhost:4000/api
VITE_BACKEND_BASE_URL=http://localhost:4000
```

**Important:** 
- `VITE_API_URL` should point to your backend API endpoint (with `/api`)
- `VITE_BACKEND_BASE_URL` is used for displaying short URLs to users

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── links.js           # API client for backend
│   ├── components/
│   │   ├── CopyButton.jsx     # Copy to clipboard button
│   │   ├── LinkForm.jsx       # Create link form
│   │   ├── LinkTable.jsx      # Links table with actions
│   │   └── Loader.jsx         # Loading spinner
│   ├── pages/
│   │   ├── Dashboard.jsx      # Main dashboard page
│   │   └── Stats.jsx          # Link statistics page
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 📱 Pages

### Dashboard (`/`)
- Create new short links
- View all links in a table
- Search/filter links
- Copy short URLs
- Delete links
- View click statistics

### Stats Page (`/code/:code`)
- Detailed statistics for a specific link
- Total clicks
- Last clicked timestamp
- Created date
- Target URL information

## 🎨 Design Features

### Form UX
- Real-time inline validation
- Clear error messages
- Disabled submit during loading
- Success notifications
- Auto-clear form after creation

### Table Features
- Responsive design
- URL truncation with full URL on hover
- Relative timestamps (e.g., "2h ago")
- Quick copy buttons
- Delete confirmation
- Empty state with helpful message

### Loading States
- Skeleton/spinner during data fetch
- Button loading states
- Smooth transitions

### Error Handling
- Network error messages
- 404 handling
- Validation errors
- User-friendly error text

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_BACKEND_BASE_URL` - Your backend base URL

4. For production:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. Add environment variables in Netlify dashboard

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to any static hosting service:
   - GitHub Pages
   - Cloudflare Pages
   - AWS S3 + CloudFront
   - Any static host

3. Configure environment variables in your hosting platform

## 🧪 Testing the App

### Local Testing

1. Start the backend (port 4000)
2. Start the frontend (port 5173)
3. Visit `http://localhost:5173`
4. Create a link and test all features

### Testing Checklist

- [ ] Create link with auto-generated code
- [ ] Create link with custom code
- [ ] Validate URL format
- [ ] Validate custom code format (6-8 chars)
- [ ] Test duplicate code error (409)
- [ ] Search links by code
- [ ] Search links by URL
- [ ] Copy short URL to clipboard
- [ ] Delete link with confirmation
- [ ] View link statistics
- [ ] Responsive design on mobile
- [ ] Error states display correctly
- [ ] Loading states work

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint (if configured)
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Styles

Global styles are in `src/index.css`. Component styles use Tailwind utility classes.

## 📦 Dependencies

### Core
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client

### Build Tools
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🐛 Troubleshooting

### API connection fails
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check for CORS errors in console
- Verify network connectivity

### Environment variables not working
- Restart dev server after changing `.env`
- Ensure variables start with `VITE_`
- Check `.env` file is in root directory

### Build fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for TypeScript errors (if using TS)

### Styling issues
- Rebuild Tailwind: `npm run build`
- Check class names are correct
- Verify Tailwind config includes all source files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or production.

## 📧 Support

For issues or questions, please open an issue on GitHub.

## 🔗 Related

- [Backend Repository](link-to-backend)
- [Live Demo](your-deployment-url)
- [API Documentation](backend-api-docs)