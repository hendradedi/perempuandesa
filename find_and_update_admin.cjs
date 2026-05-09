const https = require('https');

const PROJECT_ID = 'perempuandesa-5ab24';
const API_KEY    = 'AIzaSyARNZB_0NULar-2uxuuti1IOW9d0VmSSZU';
const TARGET_EMAIL = 'hendra.dedi@mail.unnes.ac.id';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

function httpsPatch(url, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🔍 Mencari user dengan email:', TARGET_EMAIL);
  
  const listUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?key=${API_KEY}&pageSize=100`;
  const result = await httpsGet(listUrl);
  
  if (!result.body.documents) {
    console.log('❌ Tidak bisa akses Firestore. Response:', JSON.stringify(result.body).substring(0, 300));
    return;
  }
  
  const docs = result.body.documents;
  console.log(`📋 Total pengguna ditemukan: ${docs.length}`);
  
  const found = docs.filter(doc => 
    doc.fields && doc.fields.email && doc.fields.email.stringValue === TARGET_EMAIL
  );
  
  if (found.length === 0) {
    console.log('❌ User tidak ditemukan. Email yang ada:');
    docs.forEach(d => console.log('  -', d.fields?.email?.stringValue, '| role:', d.fields?.role?.stringValue));
    return;
  }
  
  const userDoc = found[0];
  const docId = userDoc.name.split('/').pop();
  console.log(`✅ User ditemukan! ID: ${docId}`);
  console.log(`   Nama: ${userDoc.fields?.name?.stringValue || '-'}`);
  console.log(`   Role saat ini: ${userDoc.fields?.role?.stringValue || 'user'}`);
  
  // Update role to admin
  const patchUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${docId}?key=${API_KEY}&updateMask.fieldPaths=role&updateMask.fieldPaths=active`;
  
  const patchPayload = {
    fields: {
      role:   { stringValue: 'admin' },
      active: { booleanValue: true }
    }
  };
  
  console.log('\n🔄 Mengubah role menjadi admin...');
  const patchResult = await httpsPatch(patchUrl, patchPayload);
  
  if (patchResult.status === 200) {
    console.log('✅ BERHASIL! Role sudah diubah menjadi ADMIN UTAMA');
    console.log(`   Email: ${TARGET_EMAIL}`);
    console.log(`   Role baru: ${patchResult.body.fields?.role?.stringValue}`);
  } else {
    console.log('❌ Gagal update. Status:', patchResult.status);
    console.log('   Response:', JSON.stringify(patchResult.body).substring(0, 500));
  }
}

main().catch(console.error);
