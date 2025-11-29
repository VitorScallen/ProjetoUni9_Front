import React, { useState } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testDirectConnection = async () => {
    setLoading(true);
    setStatus('Testando conexão direta...');
    setLogs([]);
    try {
      addLog('Tentando: https://localhost:7181/api/Auth/list');
      const response = await axios.get('https://localhost:7181/api/Auth/list', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setStatus(`✅ Conexão direta OK! Status: ${response.status}`);
      addLog(`✅ Sucesso! Status: ${response.status}`);
      addLog(`Dados recebidos: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
      setStatus(`❌ Erro: ${error.message}`);
      addLog(`❌ Erro: ${error.message}`);
      addLog(`Response Status: ${error.response?.status || 'N/A'}`);
      addLog(`Response Data: ${JSON.stringify(error.response?.data || {})}`);
      console.error('Erro completo:', error);
    } finally {
      setLoading(false);
    }
  };

  const testProxyConnection = async () => {
    setLoading(true);
    setStatus('Testando via proxy...');
    setLogs([]);
    try {
      addLog('Tentando: /api/Auth/list (via proxy)');
      const response = await axios.get('/api/Auth/list', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setStatus(`✅ Proxy OK! Status: ${response.status}`);
      addLog(`✅ Sucesso! Status: ${response.status}`);
      addLog(`Dados recebidos: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
      setStatus(`❌ Erro: ${error.message}`);
      addLog(`❌ Erro: ${error.message}`);
      addLog(`Response Status: ${error.response?.status || 'N/A'}`);
      addLog(`Response Data: ${JSON.stringify(error.response?.data || {})}`);
      console.error('Erro completo:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setStatus('Testando login...');
    setLogs([]);
    try {
      addLog('Tentando: POST /api/Auth/login');
      addLog('Body: { email: "teste@email.com", senha: "123456" }');
      
      const response = await axios.post('/api/Auth/login', {
        email: 'teste@email.com',
        senha: '123456'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setStatus(`✅ Login OK! Status: ${response.status}`);
      addLog(`✅ Sucesso! Status: ${response.status}`);
      addLog(`Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
    } catch (error) {
      setStatus(`❌ Erro: ${error.response?.status || error.message}`);
      addLog(`❌ Erro: ${error.message}`);
      addLog(`Response Status: ${error.response?.status || 'N/A'}`);
      addLog(`Response Data: ${JSON.stringify(error.response?.data || {})}`);
      addLog(`URL chamada: ${error.config?.url}`);
      console.error('Erro completo:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSwagger = () => {
    window.open('https://localhost:7181/swagger/index.html', '_blank');
    setStatus('✅ Abrindo Swagger. Aceite o certificado SSL se solicitado.');
    addLog('Abrindo Swagger em nova aba...');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '50px auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>🔧 Teste de Conexão com API</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Use este painel para diagnosticar problemas de conexão com o backend.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={testSwagger}
          style={{
            padding: '12px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          1️⃣ Abrir Swagger (Aceitar Certificado)
        </button>
        
        <button 
          onClick={testDirectConnection}
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          2️⃣ Testar Conexão Direta (HTTPS)
        </button>
        
        <button 
          onClick={testProxyConnection}
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          3️⃣ Testar Via Proxy (GET /api/Auth/list)
        </button>

        <button 
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: '#ec4899',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          4️⃣ Testar Login (POST /api/Auth/login)
        </button>
      </div>
      
      {status && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: status.includes('✅') ? '#d1fae5' : '#fee2e2',
          color: status.includes('✅') ? '#065f46' : '#991b1b',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {status}
        </div>
      )}

      {logs.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#1f2937',
          color: '#10b981',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <strong style={{ color: '#fff' }}>📋 Logs:</strong>
          {logs.map((log, index) => (
            <div key={index} style={{ marginTop: '5px', color: log.includes('❌') ? '#ef4444' : '#10b981' }}>
              {log}
            </div>
          ))}
        </div>
      )}
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>📋 Checklist:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>API rodando em https://localhost:7181</li>
          <li>CORS configurado no backend (Program.cs)</li>
          <li>Certificado SSL aceito no navegador</li>
          <li>Frontend rodando em http://localhost:3000</li>
          <li>Endpoint correto: <code>/api/Auth/login</code></li>
        </ul>
      </div>
    </div>
  );
};

export default TestConnection;
