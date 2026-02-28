-- Adiciona campos de preferências alimentares e dieta salva pela IA
ALTER TABLE users
    ADD COLUMN dietary_restrictions TEXT,
    ADD COLUMN food_dislikes        TEXT,
    ADD COLUMN saved_diet_plan      TEXT;
