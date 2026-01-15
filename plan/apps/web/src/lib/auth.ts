import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@acme/database";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession, type NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // 👇 This tells NextAuth to use your custom dark-themed login page
  pages: {
    signIn: '/login',
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) return null;

        return user;
      }
    })
  ],

  callbacks: {
    jwt: ({ token, user, account }) => {
      if (user) {
        token.sub = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (!token.sub) return session;

      // 1. Double-check if this user actually exists in the DB
      // (This fixes the issue where deleted users stay logged in)
      const userExists = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      // 2. If user was deleted from DB, return null (forces logout)
      if (!userExists) {
        // @ts-ignore
        return null; 
      }

      // 3. If they exist, attach data as normal
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.user.provider = token.provider;
      }
      
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);