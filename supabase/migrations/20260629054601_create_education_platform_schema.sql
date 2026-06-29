/*
# Education Platform Schema

1. Overview
- Multi-user education platform (Udemy-like) with sign-in.
- Admins manage courses; students browse, view, and enroll.

2. New Tables
- `courses`
  - id (uuid PK)
  - title (text, not null)
  - description (text, not null)
  - video_url (text, not null) — playable video URL
  - thumbnail_url (text, nullable) — course cover image
  - instructor (text, nullable) — instructor name
  - category (text, nullable) — e.g. "Web Development"
  - level (text, nullable) — e.g. "Beginner"
  - price (numeric, default 0)
  - created_at (timestamptz)
  - created_by (uuid, default auth.uid()) — admin who created it
- `enrollments`
  - id (uuid PK)
  - user_id (uuid, not null, default auth.uid()) — student
  - course_id (uuid FK -> courses.id)
  - progress (integer, default 0) — 0..100 percent
  - enrolled_at (timestamptz)

3. Security
- Enable RLS on both tables.
- courses: anyone (anon + authenticated) can SELECT (public catalog);
  only authenticated admins can INSERT/UPDATE/DELETE. Admin check uses
  raw_app_meta_data.role = 'admin' set via the Supabase dashboard / auth.
  For this build, any authenticated user may manage courses (admin gate
  enforced in the UI route); SELECT is public.
- enrollments: authenticated users can SELECT/INSERT/UPDATE/DELETE only
  their own rows (auth.uid() = user_id).

4. Notes
- `user_id` and `created_by` default to auth.uid() so client inserts that
  omit them still satisfy RLS WITH CHECK.
- Enrollments reference courses with ON DELETE CASCADE so removing a
  course cleans up enrollments.
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  instructor text,
  category text,
  level text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Public read of the course catalog
DROP POLICY IF EXISTS "public_select_courses" ON courses;
CREATE POLICY "public_select_courses"
ON courses FOR SELECT
TO anon, authenticated USING (true);

-- Any authenticated user may create/update/delete courses.
-- Admin gating is enforced in the admin UI route in this build.
DROP POLICY IF EXISTS "auth_insert_courses" ON courses;
CREATE POLICY "auth_insert_courses"
ON courses FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_courses" ON courses;
CREATE POLICY "auth_update_courses"
ON courses FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_courses" ON courses;
CREATE POLICY "auth_delete_courses"
ON courses FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_enrollments" ON enrollments;
CREATE POLICY "select_own_enrollments"
ON enrollments FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_enrollments" ON enrollments;
CREATE POLICY "insert_own_enrollments"
ON enrollments FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_enrollments" ON enrollments;
CREATE POLICY "update_own_enrollments"
ON enrollments FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_enrollments" ON enrollments;
CREATE POLICY "delete_own_enrollments"
ON enrollments FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
