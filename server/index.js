const express = require('express');
const cors = require('cors');
const dbHelper = require('./db');

const app = express();

// Explicit CORS config so Vercel/Railway origins work consistently (preflight + errors)
const corsOptions = {
  origin: true, // reflect request origin (allows Vercel previews, production, localhost, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// Ensure headers are always present, even on error responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');
app.use(express.json());

const uploadsDir = path.join(__dirname, 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({ dest: uploadsDir });

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function start() {
  await dbHelper.ready;
  const db = dbHelper.getDb();

  // Accept optional profilePhoto multipart field
  app.post('/api/register', upload.single('profilePhoto'), (req, res) => {
    try {
      const { name, email, phone, age, gender, province, constituency, ward, isRegisteredVoter, voterCardNumber } = req.body;
      
      // Validate required fields
      if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
      if (!email || !email.trim()) return res.status(400).json({ error: 'email required' });
      if (!phone || !phone.trim()) return res.status(400).json({ error: 'phone required' });

      const profilePhotoFilename = req.file ? req.file.filename : null;

      // Insert with all form fields using sql.js run method
      db.run(`
        INSERT INTO members (name, email, phone, age, gender, province, constituency, ward, isRegisteredVoter, voterCardNumber, profile_photo, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name, email, phone, age || null, gender || null, province || null, constituency || null, ward || null, isRegisteredVoter || null, voterCardNumber || null, profilePhotoFilename, Date.now()]);
      dbHelper.save();
      
      // Get last insert ID more reliably
      const result = db.exec('SELECT last_insert_rowid() AS id');
      const id = (result && result[0] && result[0].values && result[0].values[0]) ? result[0].values[0][0] : null;
      
      return res.json({ id, message: 'Registration successful' });
    } catch (err) {
      console.error(err);
      if (err && err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'email exists' });
      return res.status(500).json({ error: 'db error: ' + err.message });
    }
  });

  app.get('/api/members', (req, res) => {
    try {
      const result = db.exec('SELECT id, name, email, phone, age, gender, province, constituency, ward, isRegisteredVoter, voterCardNumber, profile_photo, created_at FROM members ORDER BY id DESC');
      // Convert sql.js result to array of objects
      const rows = [];
      if (result && result[0]) {
        const cols = result[0].columns;
        const vals = result[0].values;
        for (const v of vals) {
          const obj = {};
          cols.forEach((c, i) => (obj[c] = v[i]));
          rows.push(obj);
        }
      }
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'db error' });
    }
  });

  // Update member
  app.put('/api/members/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, age, gender, province, constituency, ward, isRegisteredVoter, voterCardNumber } = req.body;

      // Validate required fields
      if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
      if (!email || !email.trim()) return res.status(400).json({ error: 'email required' });
      if (!phone || !phone.trim()) return res.status(400).json({ error: 'phone required' });

      db.run(`
        UPDATE members 
        SET name = ?, email = ?, phone = ?, age = ?, gender = ?, province = ?, constituency = ?, ward = ?, isRegisteredVoter = ?, voterCardNumber = ?
        WHERE id = ?
      `, [name, email, phone, age || null, gender || null, province || null, constituency || null, ward || null, isRegisteredVoter || null, voterCardNumber || null, id]);
      dbHelper.save();

      res.json({ message: 'Member updated successfully' });
    } catch (err) {
      console.error(err);
      if (err && err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'email already exists' });
      return res.status(500).json({ error: 'db error: ' + err.message });
    }
  });

  // Delete member
  app.delete('/api/members/:id', (req, res) => {
    try {
      const { id } = req.params;
      db.run('DELETE FROM members WHERE id = ?', [id]);
      dbHelper.save();
      res.json({ message: 'Member deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'db error: ' + err.message });
    }
  });

  // Analytics endpoint
  app.get('/api/analytics', (req, res) => {
    try {
      // Total members
      const totalResult = db.exec('SELECT COUNT(*) as count FROM members');
      const totalMembers = (totalResult && totalResult[0] && totalResult[0].values && totalResult[0].values[0]) ? totalResult[0].values[0][0] : 0;

      // Gender distribution
      const genderResult = db.exec('SELECT gender, COUNT(*) as count FROM members WHERE gender IS NOT NULL GROUP BY gender');
      const genderData = [];
      if (genderResult && genderResult[0]) {
        const cols = genderResult[0].columns;
        const vals = genderResult[0].values;
        for (const v of vals) {
          const obj = {};
          cols.forEach((c, i) => (obj[c] = v[i]));
          genderData.push(obj);
        }
      }

      // Province distribution
      const provinceResult = db.exec('SELECT province, COUNT(*) as count FROM members WHERE province IS NOT NULL GROUP BY province ORDER BY count DESC LIMIT 10');
      const provinceData = [];
      if (provinceResult && provinceResult[0]) {
        const cols = provinceResult[0].columns;
        const vals = provinceResult[0].values;
        for (const v of vals) {
          const obj = {};
          cols.forEach((c, i) => (obj[c] = v[i]));
          provinceData.push(obj);
        }
      }

      // Age statistics
      const ageResult = db.exec(`
        SELECT 
          COUNT(*) as count,
          AVG(CAST(age AS FLOAT)) as average,
          MIN(CAST(age AS INTEGER)) as minimum,
          MAX(CAST(age AS INTEGER)) as maximum
        FROM members WHERE age IS NOT NULL AND age != ''
      `);
      const ageStats = {};
      if (ageResult && ageResult[0]) {
        const cols = ageResult[0].columns;
        const vals = ageResult[0].values[0];
        cols.forEach((c, i) => (ageStats[c] = vals[i]));
      }

      // Voter registration status
      const voterResult = db.exec(`
        SELECT 
          isRegisteredVoter,
          COUNT(*) as count
        FROM members
        WHERE isRegisteredVoter IS NOT NULL
        GROUP BY isRegisteredVoter
      `);
      const voterData = [];
      if (voterResult && voterResult[0]) {
        const cols = voterResult[0].columns;
        const vals = voterResult[0].values;
        for (const v of vals) {
          const obj = {};
          cols.forEach((c, i) => (obj[c] = v[i]));
          voterData.push(obj);
        }
      }

      // Registration trend (by date)
      const trendResult = db.exec(`
        SELECT 
          DATE(created_at / 1000, 'unixepoch') as date,
          COUNT(*) as count
        FROM members
        GROUP BY DATE(created_at / 1000, 'unixepoch')
        ORDER BY date DESC
        LIMIT 30
      `);
      const trendData = [];
      if (trendResult && trendResult[0]) {
        const cols = trendResult[0].columns;
        const vals = trendResult[0].values;
        for (const v of vals) {
          const obj = {};
          cols.forEach((c, i) => (obj[c] = v[i]));
          trendData.push(obj);
        }
      }

      res.json({
        totalMembers,
        genderData,
        provinceData,
        ageStats,
        voterData,
        trendData: trendData.reverse(),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'db error: ' + err.message });
    }
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Backend listening: http://localhost:${port}`));
}

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
