-- Enable the PostgREST extension to make pgrest_exec function available
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create the pgrest_exec function that will be used for executing SQL
DROP FUNCTION IF EXISTS pgrest_exec;
CREATE OR REPLACE FUNCTION pgrest_exec(query text) RETURNS json AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;