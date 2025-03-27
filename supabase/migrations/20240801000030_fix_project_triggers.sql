-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS projects_audit_trigger ON projects;
DROP TRIGGER IF EXISTS log_project_changes ON projects;

-- Create or replace the projects_audit_function to handle the case when investor_id doesn't exist
CREATE OR REPLACE FUNCTION projects_audit_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_data, user_id, project_id)
        VALUES ('DELETE', 'project', OLD.id, row_to_json(OLD), current_setting('request.jwt.claims', true)::json->>'sub', OLD.id);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_data, new_data, user_id, project_id)
        VALUES ('UPDATE', 'project', NEW.id, row_to_json(OLD), row_to_json(NEW), current_setting('request.jwt.claims', true)::json->>'sub', NEW.id);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, new_data, user_id, project_id)
        VALUES ('INSERT', 'project', NEW.id, row_to_json(NEW), current_setting('request.jwt.claims', true)::json->>'sub', NEW.id);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the log_user_action function to handle the case when investor_id doesn't exist
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
BEGIN
    -- This is a simplified version that doesn't rely on investor_id
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_data, user_id)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD), current_setting('request.jwt.claims', true)::json->>'sub');
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_data, new_data, user_id)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW), current_setting('request.jwt.claims', true)::json->>'sub');
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, new_data, user_id)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW), current_setting('request.jwt.claims', true)::json->>'sub');
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the triggers
CREATE TRIGGER projects_audit_trigger
AFTER INSERT OR DELETE OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION projects_audit_function();

CREATE TRIGGER log_project_changes
AFTER INSERT OR DELETE OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION log_user_action();
