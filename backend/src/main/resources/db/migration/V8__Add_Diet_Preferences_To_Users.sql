-- Adiciona preferencias de dieta ao perfil do usuario
-- number_of_meals: quantas refeicoes por dia o usuario quer fazer
-- measurement_preference: GRAMS (gramas exatos) ou HOUSEHOLD (medidas caseiras)
ALTER TABLE users
    ADD COLUMN number_of_meals         INTEGER,
    ADD COLUMN measurement_preference  VARCHAR(20);
