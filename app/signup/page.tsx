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
import { BookOpen, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PERKS = [
  'Access 400+ professional courses',
  'Learn at your own pace, anytime',
  'Certificate of completion',
  'Industry-expert instructors',
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success('Welcome to OneSwipe Academy! Start learning today.');
      router.push('/dashboard');
    } else {
      toast.success('Account created! Please log in.');
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Left – benefits panel */}
            <div className="hidden flex-col justify-center gap-6 lg:flex">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-base font-extrabold tracking-tight">
                    OneSwipe <span className="text-primary">Academy</span>
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5">
                    by ONESWIPE Technologies
                  </span>
                </div>
              </Link>
              <div>
                <h2 className="text-2xl font-bold">Join thousands of learners</h2>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  Start your learning journey with OneSwipe Academy — the official training platform by
                  The ONESWIPE Technologies Pvt. Ltd.
                </p>
              </div>
              <ul className="space-y-3">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Questions?{' '}
                <a href="mailto:academy@theoneswipe.com" className="text-primary hover:underline">
                  academy@theoneswipe.com
                </a>{' '}
                ·{' '}
                <a href="tel:9100006263" className="text-primary hover:underline">
                  +91 91000 06263
                </a>
              </p>
            </div>

            {/* Right – form */}
            <div>
              <Link href="/" className="mb-6 flex items-center gap-2.5 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-extrabold">
                  OneSwipe <span className="text-primary">Academy</span>
                </span>
              </Link>

              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Create your account</CardTitle>
                  <CardDescription>Free forever — no credit card needed</CardDescription>
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
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create free account
                    </Button>
                  </form>
                  <p className="mt-5 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                      Log in
                    </Link>
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
      </div>
    </div>
  );
}
