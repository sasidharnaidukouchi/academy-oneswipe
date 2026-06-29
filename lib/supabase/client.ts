import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Course = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  instructor: string | null;
  category: string | null;
  level: string | null;
  price: number;
  original_price: number | null;
  created_at: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  enrolled_at: string;
  course?: Course;
};
