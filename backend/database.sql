-- PostgreSQL Database Setup Script for AY Digital Institute
-- Run this script in your PostgreSQL client (psql) or pgAdmin

-- Create database
CREATE DATABASE aydigital;

-- Connect to the database (run this in psql: \c aydigital)
-- Or use: psql -U postgres -d aydigital

-- The tables will be automatically created by Sequelize on first run
-- But you can also create them manually if needed:

/*
CREATE TABLE IF NOT EXISTS "Users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "phone" VARCHAR(255),
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(10) DEFAULT 'student' CHECK ("role" IN ('student', 'admin')),
  "courseInterested" VARCHAR(255),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS "Users_email_idx" ON "Users"("email");
*/

-- Note: Sequelize will automatically create the tables when you start the server
-- Make sure your .env file has the correct database credentials
