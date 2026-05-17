SET FOREIGN_KEY_CHECKS = 0;

-- Felhasználó tábla (auth)
CREATE TABLE IF NOT EXISTS Felhasznalo (
    ID            INT AUTO_INCREMENT PRIMARY KEY,
    nev           VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    jelszo_hash   VARCHAR(255) NOT NULL,
    letrehozva    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Jegy tábla (a felhasználóhoz kötve)
CREATE TABLE IF NOT EXISTS Jegy (
    ID               INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id   INT NOT NULL,
    termek_nev       VARCHAR(255) NOT NULL,
    termek_leiras    VARCHAR(500),
    ar               INT DEFAULT 0,
    utas_nev         VARCHAR(255) NOT NULL,
    okmany_szam      VARCHAR(100) NOT NULL,
    qr_url           TEXT,
    vasarlas_datum   DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (felhasznalo_id) REFERENCES Felhasznalo(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE INDEX idx_jegy_user ON Jegy(felhasznalo_id);
CREATE INDEX idx_felh_email ON Felhasznalo(email);

SET FOREIGN_KEY_CHECKS = 1;
