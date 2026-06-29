import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, PlayCircle } from 'lucide-react';
import type { Course } from '@/lib/supabase/client';

const FALLBACK_THUMBS = [
  'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600',
];

function discountPct(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const thumb = course.thumbnail_url || FALLBACK_THUMBS[index % FALLBACK_THUMBS.length];
  const hasDiscount =
    course.original_price != null && course.original_price > course.price && course.price > 0;
  const pct = hasDiscount ? discountPct(course.price, course.original_price!) : 0;

  return (
    <Link href={`/courses/${course.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={thumb}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <PlayCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          {/* Level badge */}
          {course.level && (
            <Badge className="absolute left-3 top-3 bg-primary/90 text-white shadow">
              {course.level}
            </Badge>
          )}
          {/* Discount badge */}
          {hasDiscount && (
            <Badge className="absolute right-3 top-3 bg-orange-500 text-white shadow font-bold">
              {pct}% OFF
            </Badge>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5 p-4">
          {course.category && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {course.category}
            </span>
          )}
          <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {course.description}
          </p>
          {course.instructor && (
            <p className="text-sm text-muted-foreground truncate">{course.instructor}</p>
          )}

          {/* Price row */}
          <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">4.8</span>
              <span className="text-xs text-muted-foreground">(1.2k)</span>
            </div>

            {/* Pricing */}
            <div className="flex flex-col items-end gap-0.5">
              {course.price === 0 ? (
                <span className="text-base font-bold text-primary">Free</span>
              ) : (
                <>
                  <span className="text-base font-bold text-primary">
                    ₹{Number(course.price).toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{Number(course.original_price).toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-border/60">
      <div className="aspect-video w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="flex justify-between border-t pt-2">
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="flex flex-col items-end gap-1">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </Card>
  );
}
