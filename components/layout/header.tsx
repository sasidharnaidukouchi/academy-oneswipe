'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/dashboard', label: 'My Learning' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Icon mark */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md group-hover:shadow-primary/40 transition-shadow">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-tight text-foreground">
                OneSwipe <span className="text-primary">Academy</span>
              </span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
                by ONESWIPE Technologies
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[140px] truncate text-sm">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" /> Admin Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-6 flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-extrabold">
                      OneSwipe <span className="text-primary">Academy</span>
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                      by ONESWIPE Technologies
                    </span>
                  </div>
                </Link>

                <nav className="mt-2 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Admin Panel
                  </Link>
                </nav>

                <div className="mt-2 flex flex-col gap-2 border-t pt-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/signup" onClick={() => setOpen(false)}>Get Started Free</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
