import { Dumbbell } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Dumbbell className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold tracking-tight mb-4">RepFlow</h1>
          <p className="text-lg text-muted-foreground">
            Track your workouts, crush your goals, and transform your fitness journey.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
