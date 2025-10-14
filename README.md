# Data Room Application

A secure data room application built with Next.js 15, allowing users to create nested folder structures and upload PDF files. File operations are tracked by IP address.

## Features

- **Folder Management**

  - Create folders with unique IDs
  - Support for nested folder hierarchies
  - Rename folders
  - Delete folders with confirmation dialog
  - Breadcrumb navigation

- **PDF File Management**

  - Upload PDF files (max 1MB)
  - Download files
  - Delete files
  - Rename files
  - Files stored in PostgreSQL database

- **User Tracking**
  - Track uploads by IP address
  - No authentication required (v1)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: shadcn/ui components + Tailwind CSS
- **Deployment**: Vercel (Hobby plan)
- **Local Dev**: Docker Compose for PostgreSQL
- **Architecture**: Service layer pattern for database abstraction

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Local Database

Start the PostgreSQL container:

```bash
docker-compose up -d
```

This will start a PostgreSQL database on `localhost:5438`.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://dev:devpassword@localhost:5438/dataroom"
```

### 4. Set Up Database Schema

Run Prisma migrations to create the database tables:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/dataroom](http://localhost:3000/dataroom) in your browser.

## Database Schema

The application uses two main tables:

### Folder Table

- `id` (UUID) - Primary key
- `name` - Folder name
- `parent_id` - Parent folder ID (null for root)
- `created_by` - IP address of creator
- `created_at` - Timestamp
- `updated_at` - Timestamp

### File Table

- `id` (UUID) - Primary key
- `name` - File name
- `size` - File size in bytes
- `mime_type` - MIME type (application/pdf)
- `data` - Binary file data
- `folder_id` - Parent folder ID (null for root)
- `uploaded_by` - IP address of uploader
- `created_at` - Timestamp

## API Endpoints

### Folders

- `POST /api/folders` - Create folder
- `PATCH /api/folders/[id]` - Rename folder
- `DELETE /api/folders/[id]` - Delete folder
- `GET /api/folders/[id]/contents` - Get folder contents

### Files

- `POST /api/files` - Upload file
- `DELETE /api/files/[id]` - Delete file
- `GET /api/files/[id]/download` - Download file
- `PATCH /api/files/[id]` - Rename file

### Other

- `GET /api/breadcrumbs/[folderId]` - Get breadcrumb trail

## File Size Limits

- Maximum file size: **1MB**
- Only PDF files are allowed

## Deployment

### Vercel Deployment

1. Create a PostgreSQL database (e.g., on Vercel Postgres, Supabase, or Neon)
2. Set the `DATABASE_URL` environment variable in Vercel
3. Deploy the application
4. Run migrations on the production database

```bash
npx prisma migrate deploy
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# View database in Prisma Studio
npx prisma studio

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

## Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit database records.

### Create a New Migration

After changing the Prisma schema:

```bash
npx prisma migrate dev --name description_of_changes
```

## Architecture

### Database Service Layer

The application uses a **service layer pattern** to abstract database operations from API routes. This means:

- **API routes** (`src/app/api/`) only interact with service functions, never directly with Prisma
- **Service layer** (`src/lib/db/`) contains all database operations
- **Benefits**:
  - Easy to swap databases or ORMs without touching API code
  - Centralized database logic
  - Better testability
  - Clear separation of concerns

Example:

```typescript
// ✅ API Route (uses service)
import { folderService } from "@/lib/db/folder-service";

const folder = await folderService.findById(id);

// ❌ Never do this in API routes
import { prisma } from "@/lib/prisma";
const folder = await prisma.folder.findUnique({ where: { id } });
```

If you need to change the database or ORM:

1. Update the service implementations in `src/lib/db/`
2. Keep the same function signatures
3. API routes continue working without changes

### Validation Layer

All API endpoints use **Zod schemas** for input validation and return consistent response formats:

**Success Response:**

```typescript
{
  "success": true,
  "data": { /* your data here */ }
}
```

**Error Response:**

```typescript
{
  "error": "ERROR_TYPE",  // e.g., "BAD_REQUEST", "NOT_FOUND"
  "message": "Human-readable error message",
  "details": { /* optional validation errors */ }
}
```

**Benefits:**

- Type-safe validation with Zod
- Consistent error handling across all endpoints
- Field-level validation errors
- Better client-side error handling

Example API usage:

```typescript
import { ApiResponse } from "@/lib/api-response";
import { createFolderSchema } from "@/lib/validation-schemas";

// Validate input
const validation = createFolderSchema.safeParse(body);
if (!validation.success) {
  return ApiResponse.badRequest("Invalid input", validation.error.flatten());
}

// Return success
return ApiResponse.success(data, 201);

// Return error
return ApiResponse.notFound("Folder");
```
