import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import sendLoginEmail from "./send-login-email";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.AUTH_SECRET || '',
  appName: 'Fomi',
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }, request) => {
        await sendLoginEmail(url, email);
      }
    })
  ]
});