# Sistema de Gerenciamento de Funcionários

Sistema CRUD completo para gerenciamento de funcionários com autenticação.

## 🚀 Funcionalidades

### Autenticação
- ✅ Login de usuários
- ✅ Registro de novos usuários
- ✅ Logout
- ✅ Rotas protegidas

### Gerenciamento de Funcionários
- ✅ Listar todos os funcionários
- ✅ Cadastrar novo funcionário
- ✅ Editar funcionário existente
- ✅ Inativar funcionário
- ✅ Excluir funcionário
- ✅ Busca/filtro de funcionários

## 🎨 Validações Implementadas

### Login
- E-mail obrigatório e formato válido
- Senha obrigatória (mínimo 6 caracteres)

### Registro
- Nome obrigatório (mínimo 3 caracteres)
- E-mail obrigatório e formato válido
- Senha obrigatória (mínimo 6 caracteres)
- Senha deve conter letras maiúsculas, minúsculas e números
- Confirmação de senha obrigatória
- Senhas devem coincidir

### Cadastro de Funcionário
- Nome obrigatório (mínimo 3 caracteres)
- E-mail obrigatório e formato válido
- Telefone com máscara (XX) XXXXX-XXXX
- Salário deve ser número válido e não negativo
- Data de admissão não pode ser futura

## 🛠️ Tecnologias Utilizadas

- React 19
- React Router DOM
- Axios
- CSS3 com variáveis CSS

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start
```

## 🌐 Endpoints da API

A aplicação se conecta aos seguintes endpoints (sem autenticação JWT):

### Autenticação
- `POST /api/Auth/register` - Registrar usuário
  - Body: `{ nome, email, senha }`
- `POST /api/Auth/login` - Login
  - Body: `{ email, senha }`
- `POST /api/Auth/logout` - Logout
- `GET /api/Auth/list` - Listar usuários
- `GET /api/Auth/{id}` - Buscar usuário por ID
- `PUT /api/Auth/update` - Atualizar usuário
  - Body: `UserModel`
- `PUT /api/Auth/inativar/{id}` - Inativar usuário
- `DELETE /api/Auth/delete/{id}` - Deletar usuário

### Funcionários
- `GET /api/Funcionario` - Listar funcionários
- `GET /api/Funcionario/{id}` - Buscar funcionário por ID
- `POST /api/Funcionario` - Criar funcionário
  - Body: `FuncionarioModel`
- `PUT /api/Funcionario/updateFuncionario` - Atualizar funcionário
  - Body: `FuncionarioModel`
- `PUT /api/Funcionario/inativaFuncionario?id={id}` - Inativar funcionário
- `DELETE /api/Funcionario?id={id}` - Deletar funcionário

## 📋 Estrutura de Resposta da API

Todas as respostas seguem o padrão `ServiceResponse<T>`:

```json
{
  "dados": null,
  "mensagem": "string",
  "sucesso": true
}
```

## 🎯 Estrutura de Rotas

- `/login` - Tela de login
- `/register` - Tela de cadastro
- `/funcionarios` - Lista de funcionários (protegida)
- `/funcionarios/novo` - Cadastro de funcionário (protegida)
- `/funcionarios/editar/:id` - Edição de funcionário (protegida)

## 🔐 Configuração da API

A URL da API está configurada em `src/services/api.js`:

```javascript
const API_URL = 'https://localhost:7181/api';
```

**Importante:** 
- Certifique-se de que sua API .NET está rodando nesta porta
- A API não utiliza autenticação JWT
- As credenciais são validadas via localStorage (isAuthenticated)
- Todas as respostas seguem o padrão ServiceResponse<T>

## 📱 Layout Responsivo

O sistema é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🎨 Temas e Cores

O sistema utiliza uma paleta de cores moderna:
- Primary: #4f46e5 (Roxo/Azul)
- Success: #10b981 (Verde)
- Danger: #ef4444 (Vermelho)
- Warning: #f59e0b (Laranja)

## 📝 Observações

- A autenticação é armazenada no localStorage (sem JWT)
- Todas as rotas de funcionários são protegidas e requerem que o usuário esteja logado
- Validações ocorrem tanto no frontend quanto no backend
- Mensagens de erro do backend (ServiceResponse) são exibidas ao usuário
- Interface moderna e intuitiva
- Suporte ao padrão ServiceResponse<T> do .NET

## 🐛 Tratamento de Erros

- Erros de validação são exibidos em tempo real
- Erros da API são capturados e exibidos ao usuário
- Estados de loading durante requisições
- Confirmação antes de ações destrutivas (exclusão)

## 👨‍💻 Desenvolvido por

Projeto desenvolvido para a Universidade Uninove
