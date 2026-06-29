'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { Button } from '@/components/ui/button';
import { supabase, type Course } from '@/lib/supabase/client';
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  PlayCircle,
  Monitor,
  Code2,
  PenTool,
  BarChart2,
  TrendingUp,
  Briefcase,
  Camera,
  CheckCircle2,
  Star,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';

/* ── Category data ────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Web Development', icon: <Code2 className="h-6 w-6" />, count: '120+ courses', href: '/courses?category=Web+Development' },
  { name: 'UI/UX Design',    icon: <PenTool className="h-6 w-6" />, count: '80+ courses',  href: '/courses?category=Design' },
  { name: 'Data Science',    icon: <BarChart2 className="h-6 w-6" />, count: '60+ courses',  href: '/courses?category=Data+Science' },
  { name: 'Digital Marketing', icon: <TrendingUp className="h-6 w-6" />, count: '45+ courses', href: '/courses?category=Marketing' },
  { name: 'Business',        icon: <Briefcase className="h-6 w-6" />, count: '90+ courses', href: '/courses?category=Business' },
  { name: 'Photography',     icon: <Camera className="h-6 w-6" />, count: '30+ courses',  href: '/courses?category=Photography' },
];

/* ── Why choose us ───────────────────────────────────── */
const FEATURES = [
  {
    icon: <Monitor className="h-7 w-7 text-primary" />,
    title: 'On-Demand Video Courses',
    desc: 'Watch anywhere, anytime. HD quality video lessons with lifetime access on all devices.',
  },
  {
    icon: <Award className="h-7 w-7 text-primary" />,
    title: 'Industry Certifications',
    desc: 'Earn recognised certificates that validate your skills for employers and clients.',
  },
  {
    icon: <Users className="h-7 w-7 text-primary" />,
    title: 'Expert Instructors',
    desc: 'Learn directly from vetted professionals with real-world experience in their field.',
  },
  {
    icon: <BookOpen className="h-7 w-7 text-primary" />,
    title: 'Structured Curriculum',
    desc: 'Carefully designed learning paths that take you from beginner to job-ready, step by step.',
  },
];

/* ── Testimonials ────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'Full Stack Developer',
    text: 'OneSwipe Academy completely transformed my career. The React and Node.js courses are world-class. Got placed within 2 months!',
    stars: 5,
  },
  {
    name: 'Priya Reddy',
    role: 'UI/UX Designer',
    text: "The design courses here are exceptional. Practical, hands-on, and the instructors are genuinely helpful. Highly recommend!",
    stars: 5,
  },
  {
    name: 'Kiran Babu',
    role: 'Digital Marketer',
    text: 'From zero to Google-certified in 6 weeks. The Digital Marketing Mastery course is worth every rupee.',
    stars: 5,
  },
];

/* ── Stats ───────────────────────────────────────────── */
const STATS = [
  { value: '50,000+', label: 'Active Learners' },
  { value: '400+',    label: 'Expert Courses' },
  { value: '120+',    label: 'Instructors' },
  { value: '98%',     label: 'Satisfaction Rate' },
];

/* ═══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setCourses(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-os-hero text-white">
        {/* Decorative blobs */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left copy */}
            <div className="animate-fade-in-up">
              {/* Tag */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-orange-300" />
                Official Training Platform by The ONESWIPE Technologies Pvt. Ltd.
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Learn.{' '}
                <span className="relative inline-block">
                  Grow.
                  <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-orange-400/70" />
                </span>{' '}
                Succeed.
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-relaxed text-blue-100">
                Professional online education and certification courses designed to advance your
                career — powered by{' '}
                <span className="font-semibold text-white">OneSwipe Academy</span>.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 gap-2"
                >
                  <Link href="/courses">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 gap-2"
                >
                  <Link href="/signup">
                    <PlayCircle className="h-4 w-4" /> Sign Up Free
                  </Link>
                </Button>
              </div>

              {/* Quick perks */}
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100">
                {['No credit card required', 'Lifetime course access', 'Industry certifications'].map((p) => (
                  <span key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-orange-300" /> {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Right image card */}
            <div className="relative hidden lg:block animate-fade-in-delay">
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <img
                  src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Students learning online at OneSwipe Academy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#0d1f4b]/60 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-5 -left-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                  <Award className="h-6 w-6 text-orange-300" />
                </div>
                <div>
                  <p className="text-sm font-bold">Certificate Courses</p>
                  <p className="text-xs text-blue-200">Industry-recognised credentials</p>
                </div>
              </div>
              <div className="absolute -right-4 top-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-sm">
                <Users className="h-5 w-5 text-orange-300" />
                <span className="text-sm font-semibold">50,000+ Learners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────── */}
      <section className="border-b border-border/60 bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-white/20 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-2 text-center text-white sm:py-0">
                <p className="text-2xl font-extrabold sm:text-3xl">{s.value}</p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">What do you want to learn?</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Explore Top Categories</h2>
          <p className="mt-2 text-muted-foreground">
            Hand-curated learning paths across the most in-demand skills
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {cat.icon}
              </div>
              <span className="text-sm font-semibold leading-tight">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED COURSES ──────────────────────────────── */}
      <section className="border-y border-border/60 bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Curated for you
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Featured Courses</h2>
              <p className="mt-2 text-muted-foreground">
                Start with our most popular, highly-rated courses
              </p>
            </div>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/courses">
                View all courses <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
              : courses.length === 0
              ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground">No courses yet — check back soon.</p>
                </div>
              )
              : courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── WHY ONESWIPE ──────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Why choose us</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Why OneSwipe Academy?
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
            We combine industry expertise with a learner-first approach to deliver education that
            actually works.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                {f.icon}
              </div>
              <h3 className="text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="border-y border-border/60 bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Student stories
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">What Our Learners Say</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="bg-os-hero text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
            The ONESWIPE Technologies Pvt. Ltd.
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Ready to accelerate your career?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Join 50,000+ learners on OneSwipe Academy and gain the skills that today's industry demands.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 gap-2"
            >
              <Link href="/signup">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <a href="mailto:academy@theoneswipe.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-4 w-4" /> academy@theoneswipe.com
            </a>
            <a href="tel:9100006263" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="h-4 w-4" /> +91 91000 06263
            </a>
          </div>
        </div>
      </section>

      {/* ── INSTRUCTOR CTA ────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border/60 bg-card p-8 shadow-sm sm:flex-row">
          <div>
            <h3 className="text-xl font-bold">Become an Instructor</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-lg">
              Share your expertise with thousands of learners on OneSwipe Academy. Publish your
              course today and earn from every enrollment.
            </p>
          </div>
          <Button asChild className="shrink-0 gap-2">
            <Link href="/admin">
              Start Teaching <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
