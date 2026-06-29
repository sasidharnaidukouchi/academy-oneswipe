'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase, type Course } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import {
  Star, PlayCircle, Clock, BarChart3, Globe, CheckCircle2,
  Lock, ArrowLeft, Loader2, Tag, TrendingDown, ShieldCheck,
  Zap, Award,
} from 'lucide-react';

function fmt(n: number) {
  return n.toLocaleString('en-IN');
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        setCourse(error || !data ? null : data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setEnrolled(!!data));
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this OneSwipe Academy course');
      return;
    }
    setEnrolling(true);
    const { error } = await supabase.from('enrollments').insert({ course_id: id, user_id: user.id });
    setEnrolling(false);
    if (error) {
      toast.error('Could not enroll: ' + error.message);
    } else {
      setEnrolled(true);
      toast.success('Enrolled! Start learning now.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-muted-foreground">This course may have been removed.</p>
          <Button asChild><Link href="/courses">Back to courses</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = course.original_price != null && course.original_price > course.price && course.price > 0;
  const discountPct = hasDiscount ? Math.round(((course.original_price! - course.price) / course.original_price!) * 100) : 0;
  const savings = hasDiscount ? course.original_price! - course.price : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero banner */}
      <section className="border-b border-border/60 bg-gradient-to-r from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/courses" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to courses
          </Link>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {course.category && (
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  {course.category}
                </span>
              )}
              <h1 className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">{course.title}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground">(1,240 ratings)</span>
                </div>
                {course.level && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart3 className="h-4 w-4" /> {course.level}
                  </div>
                )}
                {course.instructor && (
                  <div className="text-muted-foreground">
                    By <span className="font-semibold text-foreground">{course.instructor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video + sidebar */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left – video + content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video player */}
            <div className="overflow-hidden rounded-xl border border-border/60 bg-black shadow-lg">
              <div className="aspect-video w-full">
                <VideoPlayer url={course.video_url} locked={!enrolled} />
              </div>
            </div>

            {/* What you'll learn */}
            <div>
              <h2 className="text-xl font-bold">What You'll Learn</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  'Build real-world projects from scratch',
                  'Master core concepts with hands-on practice',
                  'Apply best practices used by professionals',
                  'Gain confidence to tackle advanced topics',
                  'Earn a completion certificate from OneSwipe Academy',
                  'Get lifetime access to course materials & updates',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold">About This Course</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{course.description}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                This course is designed to take you from the fundamentals to practical application.
                You'll follow along with real examples and build a portfolio-ready project by the end.
                Published on OneSwipe Academy — The ONESWIPE Technologies Pvt. Ltd.
              </p>
            </div>

            {/* Price comparison table */}
            {hasDiscount && (
              <div>
                <h2 className="text-xl font-bold">Price Comparison</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  See how OneSwipe Academy compares to other platforms for similar courses.
                </p>
                <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Platform</th>
                        <th className="px-4 py-3 text-right font-semibold">Typical Price</th>
                        <th className="px-4 py-3 text-right font-semibold">Your Savings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      <CompareRow
                        platform="UpGrad / upGrad Campus"
                        price={Math.round(course.price * 2.5)}
                        ourPrice={course.price}
                      />
                      <CompareRow
                        platform="Simplilearn"
                        price={Math.round(course.price * 2.1)}
                        ourPrice={course.price}
                      />
                      <CompareRow
                        platform="NIIT / Jigsaw Academy"
                        price={Math.round(course.price * 1.8)}
                        ourPrice={course.price}
                      />
                      <CompareRow
                        platform="Great Learning"
                        price={Math.round(course.price * 1.6)}
                        ourPrice={course.price}
                      />
                      <CompareRow
                        platform="Market MRP (list price)"
                        price={course.original_price!}
                        ourPrice={course.price}
                      />
                      <tr className="bg-primary/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 font-bold text-primary">
                            <ShieldCheck className="h-4 w-4" /> OneSwipe Academy
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-primary text-base font-bold">
                          ₹{fmt(course.price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge className="bg-orange-500 text-white font-bold">Best Price</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  * Competitor prices are approximate market rates for equivalent courses. Actual prices may vary by region and time.
                </p>
              </div>
            )}
          </div>

          {/* Right – sticky pricing sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 overflow-hidden border-border/60 shadow-lg">
              {/* Discount strip */}
              {hasDiscount && (
                <div className="flex items-center justify-center gap-2 bg-orange-500 py-2 text-sm font-semibold text-white">
                  <Zap className="h-4 w-4" />
                  Launch Offer — {discountPct}% OFF
                </div>
              )}

              <div className="p-6">
                {/* Price block */}
                <div className="space-y-1">
                  {course.price === 0 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-primary">Free</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-extrabold text-primary">
                          ₹{fmt(course.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-lg text-muted-foreground line-through">
                            ₹{fmt(course.original_price!)}
                          </span>
                        )}
                      </div>
                      {hasDiscount && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingDown className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold text-orange-600">
                            You save ₹{fmt(savings)} ({discountPct}% off)
                          </span>
                        </div>
                      )}
                      {hasDiscount && (
                        <p className="text-xs text-muted-foreground">
                          vs. ₹{fmt(course.original_price!)} on other platforms
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Enroll CTA */}
                <Button
                  className="mt-5 w-full text-base font-bold"
                  size="lg"
                  disabled={enrolling}
                  onClick={enrolled ? undefined : handleEnroll}
                  asChild={enrolled}
                >
                  {enrolled ? (
                    <Link href="/dashboard">Go to My Learning</Link>
                  ) : enrolling ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling…</>
                  ) : (
                    <>Enroll Now {course.price === 0 ? '— Free' : ''}</>
                  )}
                </Button>

                {!user && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link>
                    {' '}to enroll
                  </p>
                )}

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  30-day money-back guarantee
                </p>

                {/* Includes */}
                <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-sm">
                  <p className="font-semibold">This course includes:</p>
                  {[
                    { icon: <PlayCircle className="h-4 w-4" />, text: 'On-demand video — full access' },
                    { icon: <Clock className="h-4 w-4" />,      text: 'Lifetime access' },
                    { icon: <BarChart3 className="h-4 w-4" />,  text: `Level: ${course.level || 'All levels'}` },
                    { icon: <Globe className="h-4 w-4" />,       text: 'Access on mobile & web' },
                    { icon: <Award className="h-4 w-4" />,       text: 'Certificate of completion' },
                    { icon: <Tag className="h-4 w-4" />,         text: 'OneSwipe Academy certified' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Competitor note */}
                {hasDiscount && (
                  <div className="mt-4 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Why better value?</span>
                    <br />
                    Similar programs cost ₹{fmt(Math.round(course.price * 2.5))}+ on UpGrad and
                    ₹{fmt(Math.round(course.price * 2.1))}+ on Simplilearn.
                    OneSwipe Academy gives you the same industry-grade curriculum at
                    ₹{fmt(savings)} less — with lifetime access.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Price comparison row ───────────────────────────── */
function CompareRow({
  platform,
  price,
  ourPrice,
}: {
  platform: string;
  price: number;
  ourPrice: number;
}) {
  const saving = price - ourPrice;
  const pct = Math.round((saving / price) * 100);
  return (
    <tr className="hover:bg-secondary/30">
      <td className="px-4 py-3 text-muted-foreground">{platform}</td>
      <td className="px-4 py-3 text-right font-medium">₹{fmt(price)}</td>
      <td className="px-4 py-3 text-right text-green-600 font-medium">
        Save ₹{fmt(saving)} ({pct}%)
      </td>
    </tr>
  );
}

/* ── Video player ───────────────────────────────────── */
function VideoPlayer({ url, locked }: { url: string; locked: boolean }) {
  if (locked) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-background p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <p className="font-semibold">Enroll to watch this course</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Sign in and enroll to unlock the full video.
        </p>
      </div>
    );
  }

  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (youtubeMatch) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
        title="Course video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        title="Course video"
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video src={url} controls className="h-full w-full" playsInline>
      Your browser does not support the video tag.
    </video>
  );
}
