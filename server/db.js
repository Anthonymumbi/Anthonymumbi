const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'db.sqlite');

let SQL;
let db;

const ready = initSqlJs({ locateFile: file => path.join(__dirname, 'node_modules', 'sql.js', 'dist', file) })
  .then(SQLlib => {
    SQL = SQLlib;
    if (fs.existsSync(dbPath)) {
      const filebuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(new Uint8Array(filebuffer));
    } else {
      db = new SQL.Database();
      db.run(`CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        phone TEXT NOT NULL, 
        age TEXT, 
        gender TEXT, 
        province TEXT, 
        constituency TEXT, 
        ward TEXT, 
        isRegisteredVoter TEXT, 
        voterCardNumber TEXT, 
        profile_photo TEXT, 
        created_at INTEGER
      );`);
      save();
    }
    return { SQL, db };
  })
  .catch(err => {
    console.error('Failed to initialize sql.js', err);
    throw err;
  });

function save() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

module.exports = { ready, getDb: () => db, save };

// Ensure new columns exist for older DBs
ready.then(() => {
  try {
    db.run('ALTER TABLE members ADD COLUMN profile_photo TEXT');
  } catch (err) {
    // ignore if column already exists
  }
  try {
    db.run('ALTER TABLE members ADD COLUMN age TEXT');
    db.run('ALTER TABLE members ADD COLUMN gender TEXT');
    db.run('ALTER TABLE members ADD COLUMN province TEXT');
    db.run('ALTER TABLE members ADD COLUMN constituency TEXT');
    db.run('ALTER TABLE members ADD COLUMN ward TEXT');
    db.run('ALTER TABLE members ADD COLUMN isRegisteredVoter TEXT');
    db.run('ALTER TABLE members ADD COLUMN voterCardNumber TEXT');
    save();
  } catch (err) {
    // ignore if columns already exist
  }
}).catch(() => {});
