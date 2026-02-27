-- Adiciona campo de alimentos favoritos / que o usuario deseja incluir na dieta
ALTER TABLE users
    ADD COLUMN food_favorites TEXT;
