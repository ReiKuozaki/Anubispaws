import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../../db"; // your drizzle db connection
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";


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
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/password login (optional)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // find user in DB
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));

        if (!user) return null;

        // check password
        const valid = await bcrypt.compare(credentials.password, user.password ?? "");
        if (!valid) return null;

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    // Save user to DB on first Google login
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!));

        if (!existingUser) {
          await db.insert(users).values({
            email: user.email!,
            name: user.name ?? null,
            google_id: account.providerAccountId,
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        if (session.user) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
