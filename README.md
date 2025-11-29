
# 🚀 ProjetoUni9_Front

Frontend React para o sistema de gerenciamento de funcionários e autenticação.

Este projeto é a interface web que consome a API ASP.NET Core (`ProjetoUni9_API`). Permite login, cadastro, listagem, criação, edição, inativação e exclusão de funcionários, além de gerenciamento de usuários.

## ⚡ Resumo rápido

- 🛠️ Tech: React 19, React Router DOM, Axios
- 🎨 Estilo: CSS moderno e responsivo
- 🔐 Autenticação: Cookies (via backend)
- 🌐 Integração: API .NET (`https://localhost:7181/api`)

## 🧭 Estrutura importante

- `src/components/`
	- `FuncionarioJS/FuncionarioForm.js` — Formulário de cadastro/edição de funcionário
	- `FuncionarioJS/FuncionarioList.js` — Lista de funcionários com ações CRUD
	- `loginJS/Login.js` — Tela de login
	- `loginJS/Register.js` — Tela de cadastro de usuário
	- `CSS/Funcionario.css` — Estilos do módulo de funcionários
	- `CSS/Auth.css` — Estilos das telas de autenticação
- `src/services/api.js` — Serviço central de comunicação com a API (axios)
- `src/App.js` — Rotas principais e navegação
- `src/setupProxy.js` — (opcional) Proxy para desenvolvimento com HTTPS

## ▶️ Como rodar o projeto React

Siga estes passos no Windows / PowerShell:

### 1. Clone o repositório

```bash
git clone git@github.com:VitorScallen/ProjetoUni9_Front.git
```

### 2. Abra o VS Code na pasta do projeto

```powershell
cd ProjetoUni9_Front
code .
```

### 3. Instale as dependências

```powershell
npm install
```

### 4. Rode o projeto em modo desenvolvimento

```powershell
npm start
```

O app abrirá em `http://localhost:3000`.

> **Atenção:**
> - A API deve estar rodando em `https://localhost:7181` (ou ajuste a URL em `src/services/api.js` se necessário).
> - Se usar certificado self-signed, aceite o certificado no navegador.

## 🧰 Comandos úteis

- Instalar dependências: `npm install`
- Rodar em dev: `npm start`
- Build produção: `npm run build`
- Testes: `npm test`

## 📝 O que faz cada parte

- **Login/Register:**
	- Permite autenticação e cadastro de usuários (usuário ou e-mail + senha)
	- Usa cookies para manter sessão (via backend)
- **Funcionários:**
	- CRUD completo: criar, editar, listar, inativar e excluir funcionários
	- Campos: Nome, Sobrenome, Departamento (enum), Turno (enum), Ativo
	- Visual moderno, responsivo e com feedback de erros
- **Proteção de rotas:**
	- Apenas usuários autenticados acessam as telas de funcionários
- **Serviço API:**
	- Centraliza todas as chamadas HTTP para a API .NET
	- Trata erros, autenticação e mensagens amigáveis

## 📦 Estrutura de pastas resumida

```
meu-projeto-uninove/
	src/
		components/
			FuncionarioJS/
				FuncionarioForm.js
				FuncionarioList.js
			loginJS/
				Login.js
				Register.js
			CSS/
				Funcionario.css
				Auth.css
		services/
			api.js
		App.js
		index.js
```

## 🔗 Integração com a API

- O frontend espera a API rodando em `https://localhost:7181/api`.
- Endpoints consumidos:
	- `/api/auth/register` — cadastro de usuário
	- `/api/auth/login` — login
	- `/api/funcionario` — CRUD de funcionários
- Para autenticação, o cookie de sessão é gerenciado automaticamente pelo navegador.

## 📝 Observações

- O projeto foi pensado para ser simples, didático e fácil de rodar.
- Para ambiente de produção, configure variáveis de ambiente e HTTPS corretamente.
- O backend deve estar rodando e acessível para o frontend funcionar.

---

Feito com 💙 para a disciplina de Projeto Uni9.
