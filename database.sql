
CREATE DATABASE IF NOT EXISTS bolsa_empleo
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolsa_empleo;

CREATE TABLE usuario (
                         id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                         correo        VARCHAR(150) NOT NULL UNIQUE,
                         clave         VARCHAR(255) NOT NULL,
                         rol           ENUM('EMPRESA','OFERENTE','ADMIN') NOT NULL,
                         activo        BOOLEAN NOT NULL DEFAULT FALSE,
                         fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empresa (
                         id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                         usuario_id    BIGINT NOT NULL UNIQUE,
                         nombre        VARCHAR(200) NOT NULL,
                         localizacion  VARCHAR(200),
                         telefono      VARCHAR(20),
                         descripcion   TEXT,
                         CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE oferente (
                          id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                          usuario_id      BIGINT NOT NULL UNIQUE,
                          identificacion  VARCHAR(30) NOT NULL,
                          nombre          VARCHAR(100) NOT NULL,
                          primer_apellido VARCHAR(100),
                          nacionalidad    VARCHAR(80),
                          telefono        VARCHAR(20),
                          residencia      VARCHAR(200),
                          cv_path         VARCHAR(300),
                          CONSTRAINT fk_oferente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE caracteristica (
                                id       BIGINT AUTO_INCREMENT PRIMARY KEY,
                                nombre   VARCHAR(150) NOT NULL,
                                padre_id BIGINT,
                                CONSTRAINT fk_caracteristica_padre FOREIGN KEY (padre_id) REFERENCES caracteristica(id)
);

CREATE TABLE habilidad (
                           id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                           oferente_id      BIGINT NOT NULL,
                           caracteristica_id BIGINT NOT NULL,
                           nivel            INT NOT NULL,
                           CONSTRAINT chk_nivel_hab CHECK (nivel BETWEEN 1 AND 5),
                           CONSTRAINT uk_habilidad  UNIQUE (oferente_id, caracteristica_id),
                           CONSTRAINT fk_hab_oferente       FOREIGN KEY (oferente_id)       REFERENCES oferente(id),
                           CONSTRAINT fk_hab_caracteristica FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
);

CREATE TABLE puesto (
                        id             BIGINT AUTO_INCREMENT PRIMARY KEY,
                        empresa_id     BIGINT NOT NULL,
                        descripcion    VARCHAR(300) NOT NULL,
                        salario        DECIMAL(15,2),
                        tipo           ENUM('PUBLICO','PRIVADO') NOT NULL DEFAULT 'PUBLICO',
                        activo         BOOLEAN NOT NULL DEFAULT TRUE,
                        fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_puesto_empresa FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

CREATE TABLE puesto_caracteristica (
                                       id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       puesto_id        BIGINT NOT NULL,
                                       caracteristica_id BIGINT NOT NULL,
                                       nivel_minimo     INT NOT NULL,
                                       CONSTRAINT chk_nivel_pc CHECK (nivel_minimo BETWEEN 1 AND 5),
                                       CONSTRAINT uk_puesto_car UNIQUE (puesto_id, caracteristica_id),
                                       CONSTRAINT fk_pc_puesto          FOREIGN KEY (puesto_id)         REFERENCES puesto(id),
                                       CONSTRAINT fk_pc_caracteristica  FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
);

CREATE TABLE aplicacion (
                            id                BIGINT AUTO_INCREMENT PRIMARY KEY,
                            puesto_id         BIGINT NOT NULL,
                            oferente_id       BIGINT,
                            nombre_invitado   VARCHAR(200),
                            correo_invitado   VARCHAR(200),
                            telefono_invitado VARCHAR(50),
                            mensaje           VARCHAR(500),
                            cv_invitado       VARCHAR(300),
                            fecha_aplicacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_aplic_puesto   FOREIGN KEY (puesto_id)   REFERENCES puesto(id),
                            CONSTRAINT fk_aplic_oferente FOREIGN KEY (oferente_id) REFERENCES oferente(id)
);

-- ============================================================
--  Datos iniciales
-- ============================================================

-- Admin  (contraseña: admin123)
INSERT INTO usuario (correo, clave, rol, activo) VALUES
    ('admin@bolsaempleo.local',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPZdIFiRnUu',
     'ADMIN', TRUE);

-- Características jerárquicas
INSERT INTO caracteristica (nombre, padre_id) VALUES
                                                  ('Bases de Datos',           NULL),
                                                  ('Ciberseguridad',           NULL),
                                                  ('Lenguajes de programacion',NULL),
                                                  ('Tecnologias Web',          NULL),
                                                  ('Testing',                  NULL);

INSERT INTO caracteristica (nombre, padre_id) VALUES
                                                  ('MySql',      1),
                                                  ('Oracle',     1),
                                                  ('C#',         3),
                                                  ('Java',       3),
                                                  ('Kotlin',     3),
                                                  ('Python',     3),
                                                  ('HTML',       4),
                                                  ('CSS',        4),
                                                  ('JavaScript', 4),
                                                  ('JUnit',      5);

INSERT INTO caracteristica (nombre, padre_id) VALUES
                                                  ('Assertions', 15),
                                                  ('Test cases', 15);