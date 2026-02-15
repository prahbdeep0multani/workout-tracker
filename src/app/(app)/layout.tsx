import { Sidebar } from "@/components/nav/sidebar";
import { BottomNav } from "@/components/nav/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="container mx-auto max-w-6xl px-4 py-6 lg:py-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
