import { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.");
          }
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
          const response = await res.json();
          if (res.ok && response) {
            const user = {
              email: credentials.email as string,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            };
            return user;
          }
          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
  },
  secret: process.env.SECRET,
};
