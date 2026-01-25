# Prisma Migration Guide

## 🚀 Quick Start

### Step 1: Update Environment Variables

Make sure your `backend/.env` has the correct `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aydigital?schema=public"
```

**For Neon/Supabase/Railway:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### Step 2: Run Migration

```bash
cd backend
npx prisma migrate dev --name init
```

This will:
- Create migration files
- Apply migration to database
- Generate Prisma Client

### Step 3: Verify

```bash
# View database in Prisma Studio
npx prisma studio

# Or check tables directly
npx prisma db pull
```

---

## 📋 Migration Commands

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database (Development Only!)
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

### View Database
```bash
npx prisma studio
```

---

## 🔄 Migrating from Sequelize

The old Sequelize models are still in `backend/models/` but are **not used** by the new system.

**After Prisma migration is complete:**
1. Test the new auth system
2. Verify all endpoints work
3. Remove old Sequelize code (optional cleanup)

---

## ⚠️ Important Notes

- **Backup your database** before running migrations in production
- **Test migrations** in development first
- The migration will create:
  - `users` table
  - `refresh_tokens` table
  - Indexes and constraints

---

## 🐛 Troubleshooting

### Migration Fails
- Check `DATABASE_URL` is correct
- Ensure database exists
- Verify connection permissions

### Prisma Client Not Found
```bash
npx prisma generate
```

### Schema Changes
After modifying `schema.prisma`:
```bash
npx prisma migrate dev --name describe_your_change
```
