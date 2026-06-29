'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase, type Enrollment } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Loader2, BookOpen, PlayCircle, ArrowRight, GraduationCap, Mail } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setEnrollments((data as Enrollment[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return null;

  const inProgress = enrollments.filter((e) => e.progress < 100);
  const completed = enrollments.filter((e) => e.progress >= 100);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="border-b border-border/60 bg-gradient-to-r from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            OneSwipe Academy
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">My Learning Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back,{' '}
            <span className="font-semibold text-foreground">{user.email}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Card className="flex items-center gap-3 px-5 py-3 shadow-sm">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold leading-none">{enrollments.length}</p>
                <p className="text-xs text-muted-foreground">Enrolled</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 px-5 py-3 shadow-sm">
              <PlayCircle className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold leading-none">{inProgress.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 px-5 py-3 shadow-sm">
              <GraduationCap className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold leading-none">{completed.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-9 w-9 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">No courses enrolled yet</h2>
              <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                Browse the OneSwipe Academy catalog and enroll in your first course today.
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/courses">Browse Courses <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <a
              href="mailto:academy@theoneswipe.com"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-3.5 w-3.5" /> academy@theoneswipe.com
            </a>
          </div>
        ) : (
          <div className="space-y-10">
            {inProgress.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold">Continue Learning</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {inProgress.map((e) => <EnrollmentCard key={e.id} enrollment={e} />)}
                </div>
              </section>
            )}
            {completed.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold">Completed Courses</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {completed.map((e) => <EnrollmentCard key={e.id} enrollment={e} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const course = enrollment.course;
  if (!course) return null;
  const done = enrollment.progress >= 100;

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <Card className="overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary" />
          )}
          {done && (
            <Badge className="absolute right-3 top-3 bg-primary text-white">Completed</Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          {course.instructor && (
            <p className="mt-1 text-sm text-muted-foreground">{course.instructor}</p>
          )}
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium text-foreground">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
