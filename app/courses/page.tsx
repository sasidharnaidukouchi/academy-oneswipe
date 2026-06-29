'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase, type Course } from '@/lib/supabase/client';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'Design', 'Data Science', 'Marketing', 'Business', 'Photography'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState('All');

  useEffect(() => {
    setLoading(true);
    let q = supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (category !== 'All') q = q.eq('category', category);
    if (level !== 'All') q = q.eq('level', level);
    if (query.trim()) q = q.or(`title.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`);
    q.then(({ data, error }) => {
      if (!error) setCourses(data ?? []);
      setLoading(false);
    });
  }, [category, level, query]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="border-b border-border/60 bg-gradient-to-r from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">OneSwipe Academy</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Browse All Courses</h1>
          <p className="mt-2 text-muted-foreground">
            {loading ? 'Loading…' : `${courses.length} course${courses.length === 1 ? '' : 's'} available`}
          </p>
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses by title or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                variant={category === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <Button
                key={l}
                variant={level === l ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setLevel(l)}
              >
                {l}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : courses.length === 0
            ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-lg font-semibold">No courses match your filters</p>
                <p className="mt-1 text-muted-foreground text-sm">Try adjusting your search or category.</p>
              </div>
            )
            : courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading…</div>}>
      <CoursesContent />
    </Suspense>
  );
}
