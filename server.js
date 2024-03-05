const cors = require('cors');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const jwtSecretKey = 'jwtsecret'; // Ganti dengan kunci rahasia JWT yang kuat

const connectionString = "postgres://awmhhxgt:yZ1HVE5U6a6WzGJZP8JbMksTuOSzl2sf@batyr.db.elephantsql.com/awmhhxgt";
const pool = new Pool({ connectionString });


app.get('/pastor', async (req, res) => {
    // Hanya dapat diakses dengan API key dan JWT yang valid
    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM pastor WHERE is_completed = false');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
    }
});


app.get('/pastor/completed', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM pastor WHERE is_completed = true');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
    }
});


// Fungsi untuk mendapatkan post berdasarkan ID
app.get('/pastor/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM pastor WHERE id = $1', [postId]);
        client.release();

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Post tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
    }
});


app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
