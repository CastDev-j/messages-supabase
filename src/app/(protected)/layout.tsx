import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <nav className="w-full flex justify-between items-center p-4 border-b">
        <span className="font-semibold">test</span>
        <LogoutButton />
      </nav>
      <section className="flex-1 w-full max-w-3xl p-4">{children}</section>
      <footer className="w-full text-center text-xs py-4 border-t">
        <span className="text-gray-500">Protected Layout</span>
        <span className="text-gray-400 ml-2">© 2025</span>
      </footer>
    </main>
  );
}
