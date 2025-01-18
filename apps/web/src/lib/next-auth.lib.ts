import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "database";
import { userService } from "services";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  events: {
    createUser: async (message) => {
      console.log("createUser", message.user.id);
      await userService.setupNewUserAccount({ id: message.user.id as string });
    },
  },
});
