CREATE TABLE leagues (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    min_xp_to_promote INT NOT NULL,
    tier_order INT NOT NULL
);

CREATE TABLE academies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    loc_latitude VARCHAR(255) NOT NULL,
    loc_longitude VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE squads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    total_xp INT NOT NULL DEFAULT 0,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionando chaves estrangeiras na tabela users
ALTER TABLE users ADD COLUMN league_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_user_league FOREIGN KEY (league_id) REFERENCES leagues(id);

ALTER TABLE users ADD COLUMN squad_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_user_squad FOREIGN KEY (squad_id) REFERENCES squads(id);

ALTER TABLE users ADD COLUMN academy_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_user_academy FOREIGN KEY (academy_id) REFERENCES academies(id);

-- Inserindo ligas base do sistema de ranqueada
INSERT INTO leagues (name, min_xp_to_promote, tier_order) VALUES ('Bronze', 3000, 1);
INSERT INTO leagues (name, min_xp_to_promote, tier_order) VALUES ('Prata', 10000, 2);
INSERT INTO leagues (name, min_xp_to_promote, tier_order) VALUES ('Ouro', 50000, 3);
INSERT INTO leagues (name, min_xp_to_promote, tier_order) VALUES ('Diamante', 999999, 4);
