/*
# Make courses.created_by nullable

1. Changes
- Alter `courses.created_by` to be nullable. The `DEFAULT auth.uid()` is
  retained so authenticated client inserts still auto-populate the owner,
  but service-role seeding (which has no auth session) can insert without
  violating the NOT NULL constraint.

2. Security
- No RLS policy changes. Public SELECT and authenticated CRUD remain.
*/

ALTER TABLE courses ALTER COLUMN created_by DROP NOT NULL;
