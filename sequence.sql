
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Utas tábla
CREATE TABLE IF NOT EXISTS Utas (
    ID                  INT AUTO_INCREMENT PRIMARY KEY,
    Nev                 VARCHAR(255) NOT NULL,
    Diak_ig_szam        VARCHAR(50),
    Szemelyi_ig_szam    VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 2. Járművek tábla
CREATE TABLE IF NOT EXISTS Jarmuvek (
    ID                  INT AUTO_INCREMENT PRIMARY KEY,
    Tipus               VARCHAR(50),           -- pl. 'Busz', 'Tram-train', 'Villamos', 'Vonat'
    Varos               VARCHAR(100),
    Megallo             VARCHAR(150),
    Jarat_szam          VARCHAR(50),
    Indulasi_ido        TIME,
    Erkezesi_ido        TIME,
    Keses               TINYINT(1) DEFAULT 0,
    Vonat               VARCHAR(100),
    Villamos            VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 3. Jegy tábla
CREATE TABLE IF NOT EXISTS Jegy (
    ID                  INT AUTO_INCREMENT PRIMARY KEY,
    Ido                 TIME,
    Datum               DATE,
    Jarmu_ID            INT,
    FOREIGN KEY (Jarmu_ID) REFERENCES Jarmuvek(ID) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 4. Bérlet tábla
CREATE TABLE IF NOT EXISTS Berlet (
    ID                  INT AUTO_INCREMENT PRIMARY KEY,
    Orszag              VARCHAR(100),
    Varmegye            VARCHAR(100),
    Heti_Berlet         TINYINT(1) DEFAULT 0,
    Havi_Berlet         TINYINT(1) DEFAULT 0,
    Eves_Berlet         TINYINT(1) DEFAULT 0,
    Ido                 TIME,
    Datum               DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 5. Vásárlás (kapcsoló tábla)
CREATE TABLE IF NOT EXISTS Vasarlas (
    ID                  INT AUTO_INCREMENT PRIMARY KEY,
    Utas_ID             INT NOT NULL,
    Jegy_ID             INT,
    Berlet_ID           INT,
    Vasarlas_datum      DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (Utas_ID)   REFERENCES Utas(ID) ON DELETE CASCADE,
    FOREIGN KEY (Jegy_ID)   REFERENCES Jegy(ID) ON DELETE SET NULL,
    FOREIGN KEY (Berlet_ID) REFERENCES Berlet(ID) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Indexek a teljesítményhez
CREATE INDEX idx_utas_nev          ON Utas(Nev);
CREATE INDEX idx_vasarlas_utas     ON Vasarlas(Utas_ID);
CREATE INDEX idx_jegy_datum        ON Jegy(Datum);
CREATE INDEX idx_berlet_tipus      ON Berlet(Havi_Berlet, Eves_Berlet);

SET FOREIGN_KEY_CHECKS = 1;

-- Példa adatok (opcionális – kommenteld ki, ha nem kell)
-- INSERT INTO Utas (Nev, Diak_ig_szam) VALUES ('Példa Anna', 'DI987654');