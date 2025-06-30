/*
  # Add AI summary field to profiles

  1. Changes
    - Add `ai_summary` column to profiles table for storing AI-generated insights
    - Add `summary_updated_at` timestamp for tracking when AI summary was last generated
    - Update existing profiles to have default values

  2. Security
    - Maintain existing RLS policies
    - AI summary is part of user's private profile data
*/

DO $$
BEGIN
  -- Add ai_summary column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ai_summary'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ai_summary text;
  END IF;

  -- Add summary_updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'summary_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN summary_updated_at timestamptz;
  END IF;
END $$;