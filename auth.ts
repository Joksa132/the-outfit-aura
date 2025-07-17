import NextAuth, { NextAuthConfig, DefaultSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createSupabaseClient } from "./lib/supabase-client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const authOptions: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  adapter: SupabaseAdapter({
    url: process.env.AUTH_SUPABASE_URL!,
    secret: process.env.AUTH_SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;

        const supabaseClient = createSupabaseClient();

        const { data: existingUser, error: selectError } = await supabaseClient
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (selectError && selectError.code === "PGRST116") {
          await supabaseClient.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
