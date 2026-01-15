-- db name: eventplanner
-- 1. Create NextAuth Tables (Quoted Names)
CREATE TABLE "User" (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    image TEXT,
    password TEXT
);

CREATE TABLE "Account" (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, "providerAccountId")
);

CREATE TABLE "Session" (
    id TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    expires TIMESTAMP(3) NOT NULL
);

CREATE TABLE "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMP(3) NOT NULL,
    UNIQUE(identifier, token)
);

-- 2. Create App Tables (Lowercase Names, Mixed Columns)

CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    budget_limit DOUBLE PRECISION DEFAULT 0 NOT NULL,
    event_date TIMESTAMP(3),
    location TEXT,
    status TEXT DEFAULT 'PLANNING' NOT NULL,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(3) NOT NULL,
    
    -- Note: snake_case column
    owner_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE guest (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'invited' NOT NULL,
    seat_number TEXT,
    
    -- Note: quoted "eventId" column
    "eventId" INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    
    -- Note: quoted "isDone" column
    "isDone" BOOLEAN DEFAULT false NOT NULL,
    
    -- Note: quoted "eventId" column
    "eventId" INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE expense (
    id SERIAL PRIMARY KEY,
    item TEXT NOT NULL,
    cost DOUBLE PRECISION NOT NULL,
    
    -- Note: quoted "eventId" column
    "eventId" INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE track (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    spotify_id TEXT NOT NULL,
    album_art TEXT,
    
    -- Note: quoted "eventId" column
    "eventId" INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Create Indexes for Performance (Recommended for NextAuth)
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");