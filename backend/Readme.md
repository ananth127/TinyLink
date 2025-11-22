# TinyLink Backend API

Production-ready URL shortener backend built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

- ✅ Create short links with optional custom codes
- ✅ Auto-generate 6-8 character alphanumeric codes
- ✅ URL validation
- ✅ Click tracking with timestamps
- ✅ RESTful API endpoints
- ✅ 302 redirects
- ✅ Health check endpoint
- ✅ Error handling & validation
- ✅ CORS enabled
- ✅ Production-ready structure

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended for free hosting)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tinylink-backend
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

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
PORT=4000
NODE_ENV=development
BASE_URL=http://localhost:4000
```

### 4. Set up the database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Or for production (push schema without migrations)
npm run prisma:push
```

### 5. Start the server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /healthz
Response: { "ok": true, "version": "1.0" }
```

### Create Link
```
POST /api/links
Body: {
  "targetUrl": "https://example.com",
  "customCode": "docs" // optional
}
Response: 201 Created | 409 Conflict
```

### List All Links
```
GET /api/links
Query: ?search=keyword (optional)
Response: 200 OK
```

### Get Link Stats
```
GET /api/links/:code
Response: 200 OK | 404 Not Found
```

### Delete Link
```
DELETE /api/links/:code
Response: 200 OK | 404 Not Found
```

### Redirect
```
GET /:code
Response: 302 Redirect | 404 Not Found
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── db/
│   │   └── prisma.js          # Prisma client singleton
│   ├── routes/
│   │   ├── links.js           # API routes
│   │   └── redirect.js        # Redirect handler
│   ├── controllers/
│   │   └── linkController.js  # Business logic
│   ├── middlewares/
│   │   └── errorHandler.js    # Error handling
│   └── utils/
│       ├── codeGenerator.js   # Code generation
│       └── validators.js      # Zod schemas
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Database Schema

```prisma
model Link {
  id            String    @id @default(cuid())
  code          String    @unique
  targetUrl     String
  clickCount    Int       @default(0)
  lastClickedAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## 🌐 Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install && npm run prisma:generate`
   - **Start Command:** `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

### Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Add PostgreSQL database
3. Connect your GitHub repository
4. Add environment variables
5. Deploy automatically on push

### Database Setup (Neon)

1. Create account at [Neon](https://neon.tech)
2. Create new database
3. Copy connection string
4. Add to `DATABASE_URL` in environment variables
5. Run migrations:
   ```bash
   npm run prisma:push
   ```

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:4000/healthz

# Create link
curl -X POST http://localhost:4000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://example.com"}'

# Create with custom code
curl -X POST http://localhost:4000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://example.com","customCode":"docs"}'

# Get all links
curl http://localhost:4000/api/links

# Get link stats
curl http://localhost:4000/api/links/docs

# Delete link
curl -X DELETE http://localhost:4000/api/links/docs

# Test redirect
curl -L http://localhost:4000/docs
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI)
npm run prisma:push      # Push schema to database (no migrations)
```

## ⚠️ Important Notes

- Codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- Duplicate codes return `409 Conflict`
- Redirects are `302` temporary redirects
- After deletion, redirects return `404 Not Found`
- Click tracking is automatic on each redirect

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `BASE_URL` | Base URL for short links | `http://localhost:4000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🐛 Troubleshooting

### Database connection fails
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Verify network connectivity

### Port already in use
- Change `PORT` in `.env`
- Kill process using port 4000: `lsof -ti:4000 | xargs kill`

### Prisma Client not generated
- Run `npm run prisma:generate`
- Restart your IDE

## 📧 Support

For issues or questions, please open an issue on GitHub.