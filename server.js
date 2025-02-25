const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware untuk CORS
app.use(cors());
app.use(express.json()); // Untuk mem-parsing body JSON

// Endpoint untuk mendapatkan token
app.get('/api/get-token', (req, res) => {
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
        return res.status(500).send('Token GitHub tidak ditemukan di environment variables.');
    }

    // Mengirimkan token sebagai respon
    res.json({ token: githubToken });
});

// Endpoint untuk mendapatkan data repositori GitHub
app.get('/api/github-data', async (req, res) => {
    try {
        const githubToken = process.env.GITHUB_TOKEN;

        if (!githubToken) {
            return res.status(500).send('Token GitHub tidak ditemukan di environment variables.');
        }

        const response = await axios.get('https://api.github.com/user/repos', {
            headers: { Authorization: `token ${githubToken}` },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data);
        res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
    }
});

// Ekspor aplikasi untuk digunakan oleh Vercel
module.exports = app;