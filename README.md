# DOC-ARAG Chatbot Client

Next.js-based frontend client for Document Assistant - one workspace for documents.

## Features

- **Modern Chat Interface**: Anthropic-inspired design with clean, neutral aesthetics
- **Document Management**: Upload, list, and delete PDF/DOCX documents
- **Real-time Processing**: Track document processing with progress indicators
- **Internationalization**: Full support for English and Russian languages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: Full TypeScript implementation
- **Docker Ready**: Multi-stage build for production deployment

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Material Design 3 tokens
- **Icons**: Lucide React
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Containerization**: Docker with multi-stage builds
- **Proxy**: Caddy for reverse proxy and HTTPS

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- Backend service running

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8103
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Docker Deployment

### With Backend Services

1. **Start backend services first**:
   ```bash
   cd /Users/kskada/dev/doc-arag
   docker compose up -d
   ```

2. **Start frontend with Caddy**:
   ```bash
   cd /Users/kskada/dev/doc-arag-client
   docker compose up --build
   ```

3. **Access application**:
   - Frontend: https://localhost (or http://localhost redirects to 443)
   - All API requests automatically proxied through Caddy

### Network Configuration

The frontend uses the `arag-common-network` Docker network created by the backend. Ensure the backend is running first to create this network.

## Project Structure

```
doc-arag-client/
├── app/                    # Next.js App Router pages
│   ├── chat/              # Chat interface
│   ├── documents/         # Document management
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles with MD3 tokens
├── components/            # React components
│   ├── chat/             # Chat-related components
│   ├── documents/        # Document management components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and API client
│   ├── api.ts           # Backend API client
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
├── docker/
│   └── Dockerfile       # Multi-stage production build
├── caddy/
│   └── Caddyfile        # Reverse proxy configuration
└── docker-compose.yml   # Docker services configuration
```

## API Endpoints

The frontend communicates with the backend through these endpoints (proxied via Caddy):

- `POST /api/query` - Query documents with the agent
- `POST /api/uploads` - Upload documents
- `POST /api/embeddings/{document_id}` - Generate embeddings
- `GET /api/documents` - List documents
- `DELETE /api/documents/{document_id}` - Delete document
- `GET /api/tasks/{task_id}` - Check task status
- `GET /api/health` - Health check

## Environment Variables

- `NEXT_PUBLIC_API_URL` - API base URL (default: `/api` for Caddy proxy)
- `NODE_ENV` - Environment mode (`development` or `production`)

## Build for Production

```bash
npm run build
```

This creates an optimized standalone build in `.next/standalone/` ready for Docker deployment.

## Architecture

### Multi-stage Docker Build

1. **deps stage**: Installs all npm dependencies
2. **builder stage**: Compiles TypeScript and builds Next.js
3. **runner stage**: Minimal runtime with only production artifacts

### Reverse Proxy Flow

```
Browser → Caddy (443) → Next.js (3000) | FastAPI (8103)
         ↓ /           ↓ /api/*
    Frontend       Backend API
```

### Security Features

- Non-root user in Docker container
- HTTPS with automatic redirect from HTTP
- API only accessible through Caddy
- CORS handled by reverse proxy
- Content Security Policy ready

## Development Tips

### Hot Reload

The development server supports hot module replacement. Changes to components update instantly.

### Type Safety

All API responses are typed to match backend Pydantic models. TypeScript will catch type mismatches at compile time.

### Styling

Material Design 3 color tokens are defined in `globals.css` as CSS custom properties. Use them in components:

```tsx
className="bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]"
```

### Chat State Management

Chat sessions are persisted to localStorage. Clear browser storage to reset chat history if needed.

## Troubleshooting

### Port Already in Use

If ports 80 or 443 are in use:
```bash
docker compose down
# Check what's using the port
lsof -i :443
```

### API Connection Failed

1. Ensure backend is running: `docker ps | grep doc-arag`
2. Check network: `docker network ls | grep arag-common`
3. Verify Caddy logs: `docker logs doc-arag-caddy`

### Build Errors

Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

## Contributing

1. Follow Material Design 3 guidelines for UI components
2. Maintain TypeScript strict mode compliance
3. Use React hooks for state management
4. Keep components focused and reusable
5. Test responsive design on mobile

## License

This project is licensed under a **Non-Commercial License**.

**Permissions:**
- ✅ Personal use
- ✅ Educational use
- ✅ Non-commercial projects
- ✅ Modification for personal/educational purposes

**Restrictions:**
- ❌ Commercial use
- ❌ Use in revenue-generating products or services
- ❌ Distribution as part of commercial products
- ❌ Providing commercial services using this software

**Commercial License:**
For commercial use, please contact the copyright holder to obtain a commercial license.

See the [LICENSE](LICENSE) file for full terms and conditions.

Copyright (c) 2025 DOCARAG
