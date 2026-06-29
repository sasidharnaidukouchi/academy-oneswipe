'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase, type Course } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Design', 'Data Science', 'Marketing', 'Business', 'Photography'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

type FormState = {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  instructor: string;
  category: string;
  level: string;
  price: string;
  original_price: string;
};

const emptyForm: FormState = {
  title: '', description: '', video_url: '', thumbnail_url: '',
  instructor: '', category: 'Web Development', level: 'Beginner', price: '0', original_price: '',
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  const loadCourses = () => {
    supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setCourses(data ?? []);
        setLoading(false);
      });
  };

  useEffect(() => { if (user) loadCourses(); }, [user]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: Course) => {
    setEditingId(c.id);
    setForm({ title: c.title, description: c.description, video_url: c.video_url,
      thumbnail_url: c.thumbnail_url || '', instructor: c.instructor || '',
      category: c.category || 'Web Development', level: c.level || 'Beginner',
      price: String(c.price ?? 0), original_price: c.original_price ? String(c.original_price) : '' });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.video_url) {
      toast.error('Title, description, and video URL are required');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title, description: form.description, video_url: form.video_url,
      thumbnail_url: form.thumbnail_url || null, instructor: form.instructor || null,
      category: form.category, level: form.level, price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
    };
    let error;
    if (editingId) {
      ({ error } = await supabase.from('courses').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('courses').insert(payload));
    }
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editingId ? 'Course updated' : 'Course published to OneSwipe Academy');
    setOpen(false);
    loadCourses();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('courses').delete().eq('id', deleteId);
    if (error) { toast.error(error.message); } else {
      toast.success('Course removed');
      setCourses((c) => c.filter((x) => x.id !== deleteId));
    }
    setDeleteId(null);
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="border-b border-border/60 bg-gradient-to-r from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Admin Panel</span>
              </div>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Manage Courses</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                OneSwipe Academy — The ONESWIPE Technologies Pvt. Ltd.
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold">No courses published yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">Create your first course for OneSwipe Academy.</p>
            <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add First Course</Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm">
            <table className="w-full">
              <thead className="bg-secondary/60 text-left text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Category</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Level</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {courses.map((c) => (
                  <tr key={c.id} className="text-sm hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {c.thumbnail_url && <img src={c.thumbnail_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{c.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.instructor || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{c.category || '—'}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{c.level || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">
                          {c.price > 0 ? `₹${Number(c.price).toLocaleString('en-IN')}` : <span className="text-primary">Free</span>}
                        </span>
                        {c.original_price && c.original_price > c.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{Number(c.original_price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Course' : 'Publish New Course'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the course details below.' : 'Fill in the details to publish a course on OneSwipe Academy.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete React Developer Course" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will students learn?" rows={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL *</Label>
              <Input id="video_url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="YouTube, Vimeo, or direct .mp4 link" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input id="thumbnail_url" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://images.pexels.com/..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input id="instructor" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} placeholder="e.g. Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Sale Price (₹)</Label>
                <Input id="price" type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 1299" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">MRP / Original Price (₹)</Label>
                <Input id="original_price" type="number" min="0" step="1" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder="e.g. 3499 (market comparison)" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? 'Save Changes' : 'Publish Course'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this course?</DialogTitle>
            <DialogDescription>This cannot be undone. The course and all enrollments will be permanently removed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
