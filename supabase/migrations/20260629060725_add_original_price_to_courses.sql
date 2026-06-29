/*
# Add original_price column to courses

1. Changes
- Add `original_price` (numeric, nullable) to `courses`.
  This stores the MRP / market comparison price (e.g. Udemy list price)
  so the UI can show a strikethrough original alongside the OneSwipe
  sale/launch price.

2. Notes
- Nullable so existing rows and future rows without a discount are unaffected.
- No RLS changes required.
*/

ALTER TABLE courses ADD COLUMN IF NOT EXISTS original_price numeric(10,2);
