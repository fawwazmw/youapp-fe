import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export default function Splash() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-10">
        <h1 className="text-5xl font-extrabold text-center tracking-tight">YouApp</h1>
        <div className="flex gap-4">
          <Button asChild size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Link href="/login">
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white rounded-xl">
            <Link href="/register">
              <UserPlus className="w-5 h-5" />
              Register
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
