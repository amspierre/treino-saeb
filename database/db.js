const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "saep",
    password: process.env.DB_PASS || "root",
    port: process.env.DB_PORT || 5432,
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Erro ao conectar no banco:", err.message);
    } else {
        console.log("✅ Conectado ao PostgreSQL:", res.rows[0].now);
    }
});

module.exports = pool;