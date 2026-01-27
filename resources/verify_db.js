const Database = require('better-sqlite3')
const path = require('path')
const os = require('os')
const electron = require('electron')

// Locate DB
const userData =
  process.env.APPDATA ||
  (process.platform == 'darwin'
    ? process.env.HOME + '/Library/Application Support'
    : process.env.HOME + '/.config')
const dbPath = path.join(userData, 'com.electron', 'database_final_v29.sqlite') // Assuming default app name 'com.electron' from index.ts or similar

// Use provided path if known
// user info said: c:\Users\hakan\Desktop\my-super-app
// Typically userData is in AppData/Roaming/my-super-app or similar
// Inspecting main/index.ts: electronApp.setAppUserModelId('com.electron')
// So path is likely .../AppData/Roaming/com.electron/database_final_v29.sqlite

const realDbPath = 'C:\\Users\\hakan\\AppData\\Roaming\\com.electron\\database_final_v29.sqlite'

try {
  const db = new Database(realDbPath)

  // Check Topics
  const topics = db.prepare('SELECT count(*) as count FROM egitim_konular').get()
  console.log('Topic Count:', topics.count)

  // Check Column
  const tableInfo = db.prepare('PRAGMA table_info(egitim_personeller)').all()
  const hasGrup = tableInfo.some((col) => col.name === 'grup')
  console.log('Has "grup" column:', hasGrup)

  // Check default topics sample
  if (topics.count > 0) {
    const sample = db.prepare('SELECT baslik FROM egitim_konular LIMIT 5').all()
    console.log('Sample Topics:', sample)
  }
} catch (e) {
  console.error('Error:', e)
}
