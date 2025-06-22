import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
import { invitationCodeService } from "@repo/services";

const options: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  events: {
    createUser: async (message) => {
      console.log("createUser", message);

      // Check for pending invitation code (for OAuth flows)
      let planId: number | undefined;

      // In a real implementation, you might store the invitation code in a session
      // or pass it through the OAuth state parameter. For now, we'll check if
      // there's a way to get it from the request context or use a default plan.

      // Get default plan (trial) for OAuth users without invitation codes
      const trialPlan = await prisma.plan.findUnique({
        where: { name: "Trial" },
      });
      planId = trialPlan?.id;

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
