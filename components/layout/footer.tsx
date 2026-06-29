import Link from 'next/link';
import { BookOpen, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight">
                  OneSwipe <span className="text-primary">Academy</span>
                </span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5">
                  by ONESWIPE Technologies
                </span>
              </div>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Professional online education and training by
              <span className="font-medium text-foreground"> The ONESWIPE Technologies Pvt. Ltd.</span>
            </p>
            {/* Contact */}
            <div className="mt-4 space-y-2">
              <a href="mailto:academy@theoneswipe.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                academy@theoneswipe.com
              </a>
              <a href="tel:9100006263" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                +91 91000 06263
              </a>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold">Learn</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-foreground transition-colors">Browse Courses</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">My Learning</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign Up Free</Link></li>
            </ul>
          </div>

          {/* Teach */}
          <div>
            <h3 className="text-sm font-semibold">Teach</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} The ONESWIPE Technologies Pvt. Ltd. All rights reserved.</span>
          <span className="text-xs">OneSwipe Academy — Online Education &amp; Training Institute</span>
        </div>
      </div>
    </footer>
  );
}
