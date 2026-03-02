DO $$ 
DECLARE 
    fk_name text; 
BEGIN 
    SELECT constraint_name INTO fk_name 
    FROM information_schema.key_column_usage 
    WHERE table_name = 'xp_history' AND column_name = 'user_id'
    LIMIT 1;

    IF fk_name IS NOT NULL THEN 
        EXECUTE 'ALTER TABLE xp_history DROP CONSTRAINT ' || quote_ident(fk_name); 
    END IF; 
END $$;

ALTER TABLE xp_history ADD CONSTRAINT fk_xp_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
