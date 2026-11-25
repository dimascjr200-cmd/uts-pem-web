const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'biodata.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const INITIAL_DATA = [
  {
    id: 1,
    nama: 'Dimas Rizky Pandi Aprilio',
    nim: '24010110175',
    deskripsi: 'merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup',
    foto: 'frontend/assets/dimas.jpg',
    avatar: 'DR',
    warna: 'biru'
  },
  {
    id: 2,
    nama: 'Nadia Elastriani',
    nim: '24010110160',
    deskripsi: 'dengan NIM 24010110160 merupakan anggota dan mempunyai tugas mengerjakan back-end pada UTS ini',
    foto: 'frontend/assets/anggota.jpg',
    avatar: 'NE',
    warna: 'hijau'
  }
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
  }
}

function readBiodata() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [...INITIAL_DATA];
  }
}

function writeBiodata(list) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function buildInitials(nama) {
  const parts = String(nama || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

app.get('/', (req, res) => {
  res.json({
    message: 'UTS Pem Web Biodata API is running',
    endpoints: [
      'GET /api/biodata',
      'POST /api/biodata',
      'PUT /api/biodata/:id',
      'DELETE /api/biodata/:id'
    ]
  });
});

// GET all biodata
app.get('/api/biodata', (req, res) => {
  const data = readBiodata();
  res.json(data);
});

// POST create new biodata
app.post('/api/biodata', (req, res) => {
  const { nama, nim, deskripsi, foto, avatar, warna } = req.body;

  if (!nama || !nim || !deskripsi) {
    return res.status(400).json({
      message: 'Nama, NIM, dan Deskripsi wajib diisi.'
    });
  }

  const list = readBiodata();
  const nextId = list.length > 0 ? Math.max(...list.map((item) => Number(item.id) || 0)) + 1 : 1;
  const trimmedNama = String(nama).trim();

  const newEntry = {
    id: nextId,
    nama: trimmedNama,
    nim: String(nim).trim(),
    deskripsi: String(deskripsi).trim(),
    foto: foto && String(foto).trim() ? String(foto).trim() : '',
    avatar: avatar && String(avatar).trim() ? String(avatar).trim().toUpperCase() : buildInitials(trimmedNama),
    warna: warna === 'hijau' ? 'hijau' : 'biru'
  };

  list.push(newEntry);
  writeBiodata(list);

  res.status(201).json(newEntry);
});

// PUT update existing biodata
app.put('/api/biodata/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nama, nim, deskripsi, foto, avatar, warna } = req.body;

  if (!nama || !nim || !deskripsi) {
    return res.status(400).json({
      message: 'Nama, NIM, dan Deskripsi wajib diisi.'
    });
  }

  const list = readBiodata();
  const index = list.findIndex((item) => Number(item.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Biodata tidak ditemukan.' });
  }

  const existing = list[index];
  const trimmedNama = String(nama).trim();
  const updated = {
    ...existing,
    id,
    nama: trimmedNama,
    nim: String(nim).trim(),
    deskripsi: String(deskripsi).trim(),
    foto: foto !== undefined && String(foto).trim() !== '' ? String(foto).trim() : existing.foto || '',
    avatar: avatar && String(avatar).trim() ? String(avatar).trim().toUpperCase() : existing.avatar || buildInitials(trimmedNama),
    warna: warna ? (warna === 'hijau' ? 'hijau' : 'biru') : existing.warna || 'biru'
  };

  list[index] = updated;
  writeBiodata(list);

  res.json(updated);
});

// DELETE biodata
app.delete('/api/biodata/:id', (req, res) => {
  const id = Number(req.params.id);
  const list = readBiodata();
  const index = list.findIndex((item) => Number(item.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Biodata tidak ditemukan.' });
  }

  const [deleted] = list.splice(index, 1);
  writeBiodata(list);

  res.json({ message: 'Biodata berhasil dihapus.', data: deleted });
});

ensureDataFile();

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
