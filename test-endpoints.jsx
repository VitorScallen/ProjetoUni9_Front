// Script para testar TODOS os endpoints de Auth
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});

const endpoints = [
  { method: 'GET', path: '/api/Auth/list', body: null },
  { method: 'POST', path: '/api/Auth/login', body: { email: 'teste@email.com', senha: 'teste123' } },
  { method: 'POST', path: '/Auth/login', body: { email: 'teste@email.com', senha: 'teste123' } },
];

console.log('🧪 Testando endpoints de autenticação...\n');

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const postData = endpoint.body ? JSON.stringify(endpoint.body) : null;
    
    const options = {
      hostname: 'localhost',
      port: 7181,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
      agent: agent
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    console.log(`\n🔍 Testando: ${endpoint.method} https://localhost:7181${endpoint.path}`);
    if (endpoint.body) {
      console.log('📦 Body:', JSON.stringify(endpoint.body));
    }

    const req = https.request(options, (res) => {
      console.log(`✅ Status Code: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('📦 Resposta:', JSON.stringify(json, null, 2).substring(0, 300));
        } catch (e) {
          console.log('📦 Resposta:', data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`❌ Erro: ${err.message}`);
      resolve();
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function testAll() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Testes concluídos!');
  console.log('\n💡 Use o endpoint que retornou 200 ou 401 (não 404)');
}

testAll();
