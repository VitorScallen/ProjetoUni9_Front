import axios from 'axios';

// USA DIRETAMENTE A API HTTPS (já que a conexão direta funciona!)
const API_URL = 'https://localhost:7181/api';

console.log('🔧 API configurada para usar:', API_URL);
console.log('⚠️ IMPORTANTE: Certifique-se que aceitou o certificado SSL em https://localhost:7181/swagger');

// Configuração do Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout
  withCredentials: true, // Permite enviar cookies
});

// Interceptor para tratar erros de rede
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Sucesso:', response.config.method.toUpperCase(), response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ [API] Erro:', error.config?.method?.toUpperCase(), error.config?.url);
    console.error('❌ [API] Status:', error.response?.status);
    console.error('❌ [API] Mensagem:', error.message);
    console.error('❌ [API] Dados:', error.response?.data);
    console.error('❌ [API] URL Completa:', error.config?.baseURL + error.config?.url);
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('❌ Erro de rede detectado!');
      console.error('Verifique:');
      console.error('1. Se a API está rodando em https://localhost:7181');
      console.error('2. Se o CORS está configurado na API');
      console.error('3. Acesse https://localhost:7181/swagger e aceite o certificado');
      
      return Promise.reject({
        message: 'Não foi possível conectar à API. Certifique-se que o backend está rodando e o certificado foi aceito.'
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Tempo limite de conexão excedido. Verifique se a API está respondendo.'
      });
    }
    
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
    register: async (userData) => {
      try {
        const response = await api.post('/Auth/register', userData);
        // Verifica se a resposta do backend tem a estrutura ServiceResponse
        if (response.data.sucesso) {
          return response.data;
        } else {
          throw response.data.mensagem || 'Erro ao registrar usuário';
        }
      } catch (error) {
        if (error.response?.data?.mensagem) {
          throw error.response.data.mensagem;
        }
        throw error.message || 'Erro ao registrar usuário';
      }
    },

  login: async (credentials) => {
    try {
      console.log('🔐 [authService.login] Iniciando login...');
      console.log('🌐 URL Base:', API_URL);
      console.log('🎯 Endpoint completo:', API_URL + '/Auth/login');
      console.log('📦 [authService.login] Payload sendo enviado:', JSON.stringify(credentials));

      const response = await api.post('/Auth/login', credentials);

      console.log('✅ [authService.login] Resposta recebida:', response.status);
      console.log('📦 [authService.login] Dados:', response.data);
        
      if (response.data.sucesso) {
        // Armazena o usuário logado
        localStorage.setItem('user', JSON.stringify(response.data.dados));
        localStorage.setItem('isAuthenticated', 'true');
        console.log('✅ [authService.login] Usuário armazenado no localStorage');
        return response.data;
      } else {
        console.error('❌ [authService.login] Login falhou:', response.data.mensagem);
        throw new Error(response.data.mensagem || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('❌ [authService.login] Erro capturado:', error);
      console.error('❌ [authService.login] Response completo:', error.response);
      if (error.response?.data?.mensagem) {
        console.error('❌ Mensagem do backend:', error.response.data.mensagem);
        throw new Error(error.response.data.mensagem);
      }
      if (error.response?.status === 400) {
        console.error('❌ 400 - Bad Request!');
        console.error('Payload enviado:', error.config?.data);
        console.error('Response data:', error.response?.data);
        throw new Error('Dados inválidos. Verifique email e senha.');
      }
      if (error.response?.status === 404) {
        console.error('❌ 404 - Endpoint não encontrado!');
        console.error('Verifique se o endpoint existe: POST /api/Auth/login');
        throw new Error('Endpoint de login não encontrado. Verifique se a API está configurada corretamente.');
      }
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  logout: async () => {
    try {
      await api.post('/Auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  },

  getAuthById: async (id) => {
    try {
      const response = await api.get(`/Auth/${id}`);
      if (response.data.sucesso) {
        return response.data.dados;
      } else {
        throw response.data.mensagem || 'Erro ao buscar usuário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao buscar usuário';
    }
  },

  listAuth: async () => {
    try {
      const response = await api.get('/Auth/list');
      if (response.data.sucesso) {
        return response.data.dados;
      } else {
        throw response.data.mensagem || 'Erro ao listar usuários';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao listar usuários';
    }
  },

  updateAuth: async (userData) => {
    try {
      const response = await api.put('/Auth/update', userData);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao atualizar usuário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao atualizar usuário';
    }
  },

  inativarAuth: async (id) => {
    try {
      const response = await api.put(`/Auth/inativar/${id}`);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao inativar usuário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao inativar usuário';
    }
  },

  deleteAuth: async (id) => {
    try {
      const response = await api.delete(`/Auth/delete/${id}`);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao deletar usuário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao deletar usuário';
    }
  },
};

// Serviços de Funcionário
export const funcionarioService = {
  list: async () => {
    try {
      const response = await api.get('/Funcionario');
      if (response.data.sucesso) {
        return response.data.dados;
      } else {
        throw response.data.mensagem || 'Erro ao listar funcionários';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao listar funcionários';
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/Funcionario/${id}`);
      if (response.data.sucesso) {
        return response.data.dados;
      } else {
        throw response.data.mensagem || 'Erro ao buscar funcionário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao buscar funcionário';
    }
  },

  create: async (funcionarioData) => {
    try {
      const response = await api.post('/Funcionario', funcionarioData);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao criar funcionário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao criar funcionário';
    }
  },

  update: async (funcionarioData) => {
    try {
      const response = await api.put('/Funcionario/updateFuncionario', funcionarioData);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao atualizar funcionário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao atualizar funcionário';
    }
  },

  inativar: async (id) => {
    try {
      const response = await api.put(`/Funcionario/inativaFuncionario?id=${id}`);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao inativar funcionário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao inativar funcionário';
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/Funcionario?id=${id}`);
      if (response.data.sucesso) {
        return response.data;
      } else {
        throw response.data.mensagem || 'Erro ao deletar funcionário';
      }
    } catch (error) {
      if (error.response?.data?.mensagem) {
        throw error.response.data.mensagem;
      }
      throw error.message || 'Erro ao deletar funcionário';
    }
  },
};

export default api;
