import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
// import { invitationCodeService } from "@repo/services";

const options: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt", // Use JWT sessions to support credentials provider
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Credentials authorize called with:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
          passwordLength: credentials?.password
            ? (credentials.password as string).length
            : 0,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        console.log("👤 User found:", {
          id: user?.id,
          email: user?.email,
          hasPassword: !!user?.password,
          passwordHash: user?.password
            ? user.password.substring(0, 10) + "..."
            : "none",
        });

        if (!user || !user.password) {
          console.log("❌ User not found or no password");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        console.log("🔑 Password validation:", {
          isPasswordValid,
          providedPassword:
            (credentials.password as string).substring(0, 3) + "...",
          storedPasswordHash: user.password.substring(0, 10) + "...",
        });

        if (!isPasswordValid) {
          console.log("❌ Invalid password");
          return null;
        }

        console.log("✅ Authentication successful");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔧 JWT callback:", {
        hasToken: !!token,
        hasUser: !!user,
        userId: user?.id,
        tokenId: token?.id,
        email: user?.email || token?.email,
        provider: account?.provider,
      });

      // Persist the OAuth account-id or user id to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Ensure id is always present in token
      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },
    async session({ session, token }) {
      console.log("🔧 Session callback:", {
        hasSession: !!session,
        hasToken: !!token,
        tokenId: token?.id,
        tokenSub: token?.sub,
        tokenEmail: token?.email,
      });

      // Send properties to the client
      if (token && session.user) {
        session.user.id = (token.id || token.sub) as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      console.log("🔧 Final session user:", {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
      });

      return session;
    },
    async signIn({ user, account }) {
      console.log("🔧 SignIn callback:", {
        userId: user?.id,
        email: user?.email,
        provider: account?.provider,
      });
      return true;
    },
  },
  events: {
    createUser: async (message) => {
      console.log("createUser", message);

      // Check for pending invitation code (for OAuth flows)
      // let planId: number | undefined;

      // In a real implementation, you might store the invitation code in a session
      // or pass it through the OAuth state parameter. For now, we'll check if
      // there's a way to get it from the request context or use a default plan.

      // Get default plan (trial) for OAuth users without invitation codes
      const trialPlan = await prisma.plan.findUnique({
        where: { name: "Trial" },
      });
      const planId = trialPlan?.id;

      // Update user with plan
      if (planId) {
        await prisma.user.update({
          where: { id: message.user.id as string },
          data: { planId },
        });
      }
    },
  },
};

const nextAuthHandler = NextAuth(options);

// Explicitly annotate each exported property using the typeof operator
export const handlers: typeof nextAuthHandler.handlers =
  nextAuthHandler.handlers;
export const signIn: typeof nextAuthHandler.signIn = nextAuthHandler.signIn;
export const signOut: typeof nextAuthHandler.signOut = nextAuthHandler.signOut;
export const auth: typeof nextAuthHandler.auth = nextAuthHandler.auth;
