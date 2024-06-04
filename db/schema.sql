DROP DATABASE IF EXISTS chat_app_db;

-- Create the database 
CREATE DATABASE chat_app_db;

-- Switch to the new database 
--\c chat_app_db;

-- Create Users table 
--CREATE TABLE "Users" (
 -- "id" SERIAL PRIMARY KEY,
  --"username" VARCHAR(255) NOT NULL,
 -- "password" VARCHAR(255) NOT NULL,
 -- "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
 -- "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
--);

-- Create Messages table 
--CREATE TABLE "Messages" (
  --"id" SERIAL PRIMARY KEY,
 -- "content" TEXT NOT NULL,
 -- "userId" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
--  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
 -- "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
--);