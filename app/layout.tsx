import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caupona",
  description: "Restaurantes pra ir (ou que já fomos) com os amigos",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        {session?.user && (
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
            <Link href="/" className="text-lg font-semibold text-orange-700">
              Caupona
            </Link>
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <span>{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="text-orange-700 underline">
                  Sair
                </button>
              </form>
            </div>
          </header>
        )}
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
