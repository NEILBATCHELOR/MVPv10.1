-- Add status column to projects table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'status') THEN
    ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
END $$;

-- Enable realtime for projects table
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
