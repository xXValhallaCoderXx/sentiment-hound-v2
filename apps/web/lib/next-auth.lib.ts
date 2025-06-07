import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
// import { userService } from "services";

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
      console.log("createUser", message.user.id);
      // await userService.setupNewUserAccount({ id: message.user.id as string });
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
