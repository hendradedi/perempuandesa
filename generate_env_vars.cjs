const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'perempuandesa-5ab24-firebase-adminsdk-fbsvc-ca42afb25b.json');

if (!fs.existsSync(jsonPath)) {
  console.error('File JSON service account tidak ditemukan!');
  process.exit(1);
}

const sa = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('\n=== SALIN DAN TEMPEL KE VERCEL / .env ===\n');
console.log(`FIREBASE_PROJECT_ID=${sa.project_id}`);
console.log(`FIREBASE_CLIENT_EMAIL=${sa.client_email}`);
// Gunakan JSON.stringify untuk memastikan newline \n tersimpan sebagai string literal yang bisa diparse replace(/\\n/g, '\n')
console.log(`FIREBASE_PRIVATE_KEY=${JSON.stringify(sa.private_key).replace(/^"|"$/g, '')}`);
console.log('\n=========================================\n');
