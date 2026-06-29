'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { BookOpen, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Welcome back to OneSwipe Academy!');
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex flex-col items-center gap-1 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="mt-2 text-xl font-extrabold tracking-tight">
              OneSwipe <span className="text-primary">Academy</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              by ONESWIPE Technologies
            </span>
          </Link>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Log in to continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Log in
                </Button>
              </form>
              <p className="mt-5 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Sign up free
                </Link>
              </p>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Need help?{' '}
                <a href="mailto:academy@theoneswipe.com" className="hover:underline">
                  academy@theoneswipe.com
                </a>
              </p>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
