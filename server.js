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

app.put('/pastor/:id', authenticateJWTAdmin, async (req, res) => {
    const postId = req.params.id;

    try {
        const { is_completed } = req.body;

        const result = await pool.query('UPDATE pastor SET is_completed = $1 WHERE id = $2', [is_completed, postId]);

        if (result.rowCount > 0) {
            res.json({ message: 'Status is_completed berhasil diperbarui' });
        } else {
            res.status(404).json({ message: 'Post tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat memperbarui status is_completed');
    }
});

app.get('/qrlink',  authenticateJWTAdmin, async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM qrlink WHERE main = 1');
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

app.put('/qrlink/edit', authenticateJWTAdmin, async (req, res) => {
    const { newLink } = req.body;

    try {
        const client = await pool.connect();

        // Assuming you have an 'id' field in your qrlink table
        const result = await pool.query(
            'UPDATE qrlink SET link = $1', // Update based on your actual schema
            [newLink]
        );

        client.release();

        if (result.rowCount > 0) {
            res.json({ message: 'QR link updated successfully' });
        } else {
            res.status(404).json({ message: 'QR link not found for update' });
        }
    } catch (error) {
        console.error('Error updating QR link:', error);
        res.status(500).json({ message: 'An error occurred while updating QR link' });
    }
});

//kategori pendidikan
app.post('/pastor', authenticateJWTUser, async (req, res) => {
    const { name, content } = req.body;

// Ganti dengan token yang benar

    try {

        const client = await pool.connect();
        const query = 'INSERT INTO pastor (name, content, category, is_completed) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, content, 'Pendidikan', false]; // Set default category and is_completed
        const result = await client.query(query, values);
        const insertedPost = result.rows[0];
        client.release();
        res.json(insertedPost);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan data');
    }
});

app.post('/pastor/keluarga', authenticateJWTUser, async (req, res) => {
    const { name, content, token } = req.body;

// Ganti dengan token yang benar
    const validToken = "dani";

    try {
        if (token !== validToken) {
            return res.status(403).send('Akses ditolak');
        }

        const client = await pool.connect();
        const query = 'INSERT INTO pastor (name, content, category, is_completed) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, content, 'Keluarga', false]; // Set default category and is_completed
        const result = await client.query(query, values);
        const insertedPost = result.rows[0];
        client.release();
        res.json(insertedPost);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan data');
    }
});

app.post('/pastor/percintaan', authenticateJWTUser, async (req, res) => {
    const { name, content, token } = req.body;

// Ganti dengan token yang benar
    const validToken = "dani";

    try {
        if (token !== validToken) {
            return res.status(403).send('Akses ditolak');
        }

        const client = await pool.connect();
        const query = 'INSERT INTO pastor (name, content, category, is_completed) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, content, 'Percintaan', false]; // Set default category and is_completed
        const result = await client.query(query, values);
        const insertedPost = result.rows[0];
        client.release();
        res.json(insertedPost);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan data');
    }
});

app.post('/pastor/pekerjaan', authenticateJWTUser, async (req, res) => {
    const { name, content, token } = req.body;

// Ganti dengan token yang benar
    const validToken = "dani";

    try {
        if (token !== validToken) {
            return res.status(403).send('Akses ditolak');
        }

        const client = await pool.connect();
        const query = 'INSERT INTO pastor (name, content, category, is_completed) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, content, 'Pekerjaan', false]; // Set default category and is_completed
        const result = await client.query(query, values);
        const insertedPost = result.rows[0];
        client.release();
        res.json(insertedPost);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan data');
    }
});

app.delete('/pastor/:id', authenticateJWTAdmin, async (req, res) => {
    const postId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM pastor WHERE id = $1', [postId]);

        if (result.rowCount > 0) {
            res.json({ message: 'Post berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Post tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat menghapus data');
    }
});

app.get('/announcements', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM announcements');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
