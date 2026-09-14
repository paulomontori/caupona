import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const { data } = await supabaseAdmin
        .from("allowed_users")
        .select("email")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();

      return data !== null;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    error: "/unauthorized",
  },
});
