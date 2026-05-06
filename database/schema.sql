-- Suppression des tables existantes
DROP TABLE IF EXISTS mots_audio CASCADE;
DROP TABLE IF EXISTS favoris CASCADE;
DROP TABLE IF EXISTS historique_recherche CASCADE;
DROP TABLE IF EXISTS mots CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- ============================================
-- 1. TABLE DES CATÉGORIES (pour organiser les mots)
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icone VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABLE DES MOTS (dictionnaire principal)
-- ============================================
CREATE TABLE mots (
    id SERIAL PRIMARY KEY,
    mot_francais VARCHAR(255) NOT NULL,
    mot_senoufo VARCHAR(255) NOT NULL,
    prononciation VARCHAR(255),  -- Guide de prononciation textuel
    definition TEXT,              -- Définition en français
    exemple_phrase TEXT,          -- Exemple d'utilisation
    categorie_id INT,
    niveau VARCHAR(20) CHECK (niveau IN ('débutant', 'intermédiaire', 'avancé')),
    frequence_usage INT DEFAULT 0, -- Popularité du mot
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_valide BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_categorie FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

-- ============================================
-- 3. TABLE DES FICHIERS AUDIO (prononciation)
-- ============================================
CREATE TABLE mots_audio (
    id SERIAL PRIMARY KEY,
    mot_id INT NOT NULL,
    chemin_fichier VARCHAR(500) NOT NULL,  -- Chemin vers le fichier audio
    format_audio VARCHAR(10) DEFAULT 'mp3',
    duree_secondes DECIMAL(5,2),           -- Durée de l'audio
    taille_fichier INT,                     -- Taille en bytes
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mot_audio FOREIGN KEY (mot_id) REFERENCES mots(id) ON DELETE CASCADE
);

-- ============================================
-- 4. TABLE DES UTILISATEURS (pour suivi personnalisé)
-- ============================================
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    niveau_apprentissage VARCHAR(20) DEFAULT 'débutant',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP,
    est_actif BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 5. TABLE DES FAVORIS (mots préférés des utilisateurs)
-- ============================================
CREATE TABLE favoris (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    mot_id INT NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favoris_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_favoris_mot FOREIGN KEY (mot_id) REFERENCES mots(id) ON DELETE CASCADE,
    UNIQUE(utilisateur_id, mot_id)
);

-- ============================================
-- 6. TABLE D'HISTORIQUE DE RECHERCHE
-- ============================================
CREATE TABLE historique_recherche (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    mot_recherche VARCHAR(255) NOT NULL,
    date_recherche TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultats_trouves INT,
    CONSTRAINT fk_historique_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- ============================================
-- CRÉATION DES INDEX (pour les performances)
-- ============================================
CREATE INDEX idx_mots_francais ON mots(mot_francais);
CREATE INDEX idx_mots_senoufo ON mots(mot_senoufo);
CREATE INDEX idx_mots_categorie ON mots(categorie_id);
CREATE INDEX idx_mots_niveau ON mots(niveau);
CREATE INDEX idx_audio_mot ON mots_audio(mot_id);
CREATE INDEX idx_favoris_user ON favoris(utilisateur_id);
CREATE INDEX idx_historique_user ON historique_recherche(utilisateur_id);
CREATE INDEX idx_historique_date ON historique_recherche(date_recherche);

-- ============================================
-- INSERCTION DES CATÉGORIES
-- ============================================
INSERT INTO categories (nom, description, icone) VALUES
('Salutations', 'Mots de salutation et politesse', '👋'),
('Famille', 'Membres de la famille', '👨‍👩‍👧‍👦'),
('Nourriture', 'Aliments et boissons', '🍽️'),
('Animaux', 'Noms des animaux', '🐕'),
('Couleurs', 'Noms des couleurs', '🎨'),
('Nombres', 'Chiffres et nombres', '🔢'),
('Corps humain', 'Parties du corps', '🧍'),
('Maison', 'Objets de la maison', '🏠'),
('Nature', 'Éléments naturels', '🌿'),
('Verbes courants', 'Actions du quotidien', '🏃');

-- ============================================
-- INSERCTION DES MOTS (EXEMPLES)
-- ============================================
INSERT INTO mots (mot_francais, mot_senoufo, prononciation, definition, exemple_phrase, categorie_id, niveau, frequence_usage) VALUES
-- Salutations
('Bonjour', 'I ni ce', 'ee nee cheh', 'Formule de salutation', 'I ni ce, comment allez-vous?', 1, 'débutant', 100),
('Merci', 'I ni ké', 'ee nee keh', 'Exprimer sa gratitude', 'I ni ké pour votre aide', 1, 'débutant', 95),
('Au revoir', 'N''gaa', 'ngah', 'Formule de départ', 'N''gaa, à demain!', 1, 'débutant', 90),
('Bonsoir', 'I ce suu', 'ee cheh soo', 'Saluer le soir', 'I ce suu, bonne nuit', 1, 'débutant', 85),

-- Famille
('Père', 'Ba', 'bah', 'Le père de famille', 'Mon ba travaille beaucoup', 2, 'débutant', 88),
('Mère', 'Na', 'nah', 'La mère de famille', 'Ma na cuisine bien', 2, 'débutant', 92),
('Frère', 'Kele', 'keh-leh', 'Frère (cadet ou aîné)', 'Mon kele joue au foot', 2, 'débutant', 78),
('Sœur', 'Nya', 'nyah', 'Sœur', 'Ma nya étudie beaucoup', 2, 'débutant', 80),
('Enfant', 'Pii', 'pee', 'Jeune personne', 'Les pii vont à l''école', 2, 'débutant', 85),

-- Nourriture
('Riz', 'Malo', 'mah-loh', 'Céréale de base', 'Le malo est délicieux', 3, 'débutant', 95),
('Eau', 'Ji', 'jee', 'Liquide vital', 'Bois du ji frais', 3, 'débutant', 98),
('Viande', 'Namu', 'nah-moo', 'Chair animale', 'La namu grillée sent bon', 3, 'intermédiaire', 75),
('Poisson', 'Jige', 'jee-geh', 'Animal aquatique', 'Le jige est frais', 3, 'intermédiaire', 70),

-- Animaux
('Chien', 'Wulu', 'woo-loo', 'Animal domestique', 'Le wulu aboie', 4, 'débutant', 82),
('Chat', 'Yakoro', 'yah-koh-roh', 'Animal félin', 'Le yakoro chasse les souris', 4, 'débutant', 78),
('Vache', 'Misi', 'mee-see', 'Bovin domestique', 'La misi donne du lait', 4, 'intermédiaire', 68),
('Oiseau', 'Konyan', 'kohn-yahn', 'Animal ailé', 'Le konyan vole haut', 4, 'débutant', 72),

-- Couleurs
('Rouge', 'Wolo', 'woh-loh', 'Couleur du feu', 'Le ciel est wolo', 5, 'débutant', 65),
('Noir', 'Fiin', 'feen', 'Couleur sombre', 'Son habit est fiin', 5, 'débutant', 70),
('Blanc', 'Fie', 'fee-eh', 'Couleur claire', 'La neige est fie', 5, 'débutant', 68),
('Vert', 'Niin', 'neen', 'Couleur de la nature', 'Les feuilles sont niin', 5, 'intermédiaire', 60),

-- Nombres (1-10)
('Un', 'Den', 'den', 'Premier nombre', 'J''ai un den frère', 6, 'débutant', 95),
('Deux', 'Saan', 'sahn', 'Deuxième nombre', 'J''ai deux saan mains', 6, 'débutant', 93),
('Trois', 'Saa', 'sah', 'Troisième nombre', 'Il a trois saa enfants', 6, 'débutant', 90),
('Quatre', 'Nyaan', 'nyahn', 'Quatrième nombre', 'Quatre nyaan saisons', 6, 'intermédiaire', 85),
('Cinq', 'Kunu', 'koo-noo', 'Cinquième nombre', 'Cinq kunu doigts', 6, 'intermédiaire', 88),

-- Verbes courants
('Manger', 'Daga', 'dah-gah', 'Prendre de la nourriture', 'Je veux daga le riz', 10, 'débutant', 96),
('Boire', 'Bon', 'bohn', 'Ingérer un liquide', 'Il faut bon de l''eau', 10, 'débutant', 94),
('Dormir', 'Kpo', 'kpoh', 'Se reposer', 'Les enfants kpo tôt', 10, 'débutant', 86),
('Aller', 'Ta', 'tah', 'Se déplacer vers', 'Je ta au marché', 10, 'débutant', 90),
('Venir', 'Nya', 'nyah', 'Se rapprocher', 'Nya à la maison', 10, 'débutant', 88),
('Voir', 'Nyon', 'nyohn', 'Percevoir par la vue', 'Je nyon un oiseau', 10, 'intermédiaire', 82);

-- ============================================
-- FONCTION POUR LA MISE À JOUR AUTOMATIQUE (modification date)
-- ============================================
CREATE OR REPLACE FUNCTION update_modification_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mots_modification
    BEFORE UPDATE ON mots
    FOR EACH ROW
    EXECUTE FUNCTION update_modification_date();

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue des mots avec leurs catégories
CREATE VIEW v_mots_complets AS
SELECT 
    m.id,
    m.mot_francais,
    m.mot_senoufo,
    m.prononciation,
    m.definition,
    m.exemple_phrase,
    c.nom AS categorie,
    m.niveau,
    m.frequence_usage,
    ma.chemin_fichier AS audio_path
FROM mots m
LEFT JOIN categories c ON m.categorie_id = c.id
LEFT JOIN mots_audio ma ON m.id = ma.mot_id
WHERE m.est_valide = TRUE;

-- Vue des mots populaires
CREATE VIEW v_mots_populaires AS
SELECT 
    mot_francais,
    mot_senoufo,
    frequence_usage
FROM mots
WHERE frequence_usage > 80
ORDER BY frequence_usage DESC;

-- ============================================
-- PROCÉDURES STOCKÉES UTILES
-- ============================================

-- Écrire une procédure pour ajouter un mot
CREATE OR REPLACE FUNCTION ajouter_mot(
    p_francais VARCHAR,
    p_senoufo VARCHAR,
    p_categorie_nom VARCHAR,
    p_niveau VARCHAR,
    p_definition TEXT DEFAULT NULL,
    p_exemple TEXT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    v_categorie_id INT;
    v_mot_id INT;
BEGIN
    -- Récupérer ou créer la catégorie
    SELECT id INTO v_categorie_id FROM categories WHERE nom = p_categorie_nom;
    IF v_categorie_id IS NULL THEN
        INSERT INTO categories (nom) VALUES (p_categorie_nom) RETURNING id INTO v_categorie_id;
    END IF;
    
    -- Insérer le mot
    INSERT INTO mots (mot_francais, mot_senoufo, categorie_id, niveau, definition, exemple_phrase)
    VALUES (p_francais, p_senoufo, v_categorie_id, p_niveau, p_definition, p_exemple)
    RETURNING id INTO v_mot_id;
    
    RETURN v_mot_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INSERTION D'EXEMPLES D'AUDIO (chemins fictifs)
-- ============================================
INSERT INTO mots_audio (mot_id, chemin_fichier, format_audio, duree_secondes) VALUES
(1, '/audio/salutations/bonjour.mp3', 'mp3', 1.2),
(2, '/audio/salutations/merci.mp3', 'mp3', 1.0),
(5, '/audio/famille/pere.mp3', 'mp3', 1.1),
(6, '/audio/famille/mere.mp3', 'mp3', 1.1),
(9, '/audio/nourriture/riz.mp3', 'mp3', 0.9),
(10, '/audio/nourriture/eau.mp3', 'mp3', 0.8);

-- ============================================
-- INSERTION D'UN UTILISATEUR EXEMPLE
-- ============================================
INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe, niveau_apprentissage) VALUES
('apprenant1', 'apprenant@email.com', 'motdepasse_hashé_ici', 'débutant');

-- Ajouter des favoris pour l'utilisateur
INSERT INTO favoris (utilisateur_id, mot_id) VALUES
(1, 1), (1, 2), (1, 5), (1, 10);
