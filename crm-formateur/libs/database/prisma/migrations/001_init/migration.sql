-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COLLABORATOR');
CREATE TYPE "ContactStatus" AS ENUM ('PROSPECT', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST');
CREATE TYPE "SessionStatus" AS ENUM ('PLANNED', 'CONFIRMED', 'DONE', 'CANCELLED');

-- CreateTable users
CREATE TABLE "users" (
    "id"        TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "role"      "Role" NOT NULL DEFAULT 'COLLABORATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateTable contacts
CREATE TABLE "contacts" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "company"     TEXT,
    "status"      "ContactStatus" NOT NULL DEFAULT 'PROSPECT',
    "tags"        TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastContact" TIMESTAMP(3),
    "notes"       TEXT,
    "position"    INTEGER NOT NULL DEFAULT 0,
    "assigneeId"  TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "contacts_status_idx" ON "contacts"("status");
CREATE INDEX "contacts_assigneeId_idx" ON "contacts"("assigneeId");

-- CreateTable sessions
CREATE TABLE "sessions" (
    "id"             TEXT NOT NULL,
    "title"          TEXT NOT NULL,
    "contactId"      TEXT NOT NULL,
    "collaboratorId" TEXT,
    "date"           TIMESTAMP(3) NOT NULL,
    "duration"       INTEGER NOT NULL,
    "status"         "SessionStatus" NOT NULL DEFAULT 'PLANNED',
    "notes"          TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sessions_contactId_idx" ON "sessions"("contactId");
CREATE INDEX "sessions_date_idx" ON "sessions"("date");
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateTable pipeline_columns
CREATE TABLE "pipeline_columns" (
    "id"       TEXT NOT NULL,
    "title"    TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "slug"     TEXT NOT NULL,
    CONSTRAINT "pipeline_columns_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "pipeline_columns_slug_key" ON "pipeline_columns"("slug");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_assigneeId_fkey"
    FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_contactId_fkey"
    FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_collaboratorId_fkey"
    FOREIGN KEY ("collaboratorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed default pipeline columns
INSERT INTO "pipeline_columns" ("id", "title", "position", "slug") VALUES
    ('col_new',       'Nouveaux',    0, 'new'),
    ('col_contacted', 'Contactés',   1, 'contacted'),
    ('col_proposal',  'Proposition', 2, 'proposal'),
    ('col_won',       'Gagnés',      3, 'won'),
    ('col_lost',      'Perdus',      4, 'lost');
