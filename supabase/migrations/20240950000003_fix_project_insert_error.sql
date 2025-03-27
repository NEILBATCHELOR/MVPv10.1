-- Drop the problematic trigger on projects table
DROP TRIGGER IF EXISTS projects_audit_trigger ON projects;

-- Create a fixed version of the trigger function that doesn't reference investor_id
CREATE OR REPLACE FUNCTION projects_audit_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_data, timestamp)
        VALUES ('DELETE', 'project', OLD.id, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_data, new_data, timestamp)
        VALUES ('UPDATE', 'project', NEW.id, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, new_data, timestamp)
        VALUES ('INSERT', 'project', NEW.id, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with the fixed function
CREATE TRIGGER projects_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION projects_audit_function();
