import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/client";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [credentials.email]);
        const user = (rows as any[])[0];
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password ?? "");
        if (!valid) return null;

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [user.email]);
        const existingUser = (rows as any[])[0];

        if (!existingUser) {
          await db.query('INSERT INTO users (email, name, google_id) VALUES (?, ?, ?)', [
            user.email,
            user.name,
            account.providerAccountId,
          ]);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
