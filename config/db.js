const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool de connexions PostgreSQL
const poolConfig = process.env.DATABASE_URL
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Ajout indispensable pour Render + Neon
      }
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'senoufo_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    };

const pool = new Pool(poolConfig);

/**
 * SOLUTION POUR NEON POOLER : 
 * On définit le schéma 'public' immédiatement après chaque nouvelle connexion.
 * Cela évite l'erreur "relation utilisateurs does not exist".
 */
pool.on('connect', (client) => {
  client.query('SET search_path TO public;')
    .catch(err => console.error('Erreur lors du SET search_path', err));
});

// Événement en cas d'erreur inattendue sur un client inactif
pool.on('error', (err, client) => {
  console.error('Erreur inattendue sur un client PostgreSQL inactif', err);
  // Ne pas quitter le processus brutalement sur Render pour éviter les crashs en boucle
});

// Fonction utilitaire pour exécuter des requêtes
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // On logge en développement OU si c'est une erreur pour débugger sur Render
    if (process.env.NODE_ENV === 'development') {
      console.log('Requête exécutée', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête', { text, error });
    throw error;
  }
};

module.exports = {
  query,
  pool
};