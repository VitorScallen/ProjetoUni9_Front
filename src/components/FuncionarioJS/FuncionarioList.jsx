import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionarioService, authService } from '../../services/api';
import '../CSS/Funcionario.css';

const FuncionarioList = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [funcionarioToDelete, setFuncionarioToDelete] = useState(null);

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await funcionarioService.list();
      setFuncionarios(data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setError('Erro ao carregar a lista de funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await funcionarioService.delete(id);
      setFuncionarios(funcionarios.filter((f) => f.id !== id));
      setShowModal(false);
      setFuncionarioToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      setError('Erro ao deletar funcionário');
    }
  };

  const handleInativar = async (id) => {
    try {
      await funcionarioService.inativar(id);
      await loadFuncionarios(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao inativar funcionário:', error);
      setError('Erro ao inativar funcionário');
    }
  };

  const confirmDelete = (funcionario) => {
    setFuncionarioToDelete(funcionario);
    setShowModal(true);
  };

  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const searchLower = searchTerm.toLowerCase();
    const nomeCompleto = `${funcionario.nome} ${funcionario.sobrenome}`.toLowerCase();
    return (
      nomeCompleto.includes(searchLower) ||
      funcionario.departamento?.toLowerCase().includes(searchLower) ||
      funcionario.turno?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="funcionario-container">
      <div className="funcionario-header">
        <div>
          <h1>Gerenciamento de Funcionários</h1>
          <p>Total: {funcionarios.length} funcionário(s)</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/funcionarios/novo')} className="btn btn-primary">
            + Novo Funcionário
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            Sair
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nome, departamento ou turno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="table-container">
          <table className="funcionario-table">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>Departamento</th>
                <th>Turno</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {searchTerm
                      ? 'Nenhum funcionário encontrado'
                      : 'Nenhum funcionário cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredFuncionarios.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td>{funcionario.nome} {funcionario.sobrenome}</td>
                    <td>{funcionario.departamento}</td>
                    <td>{funcionario.turno}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          funcionario.ativo ? 'status-active' : 'status-inactive'
                        }`}
                      >
                        {funcionario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => navigate(`/funcionarios/editar/${funcionario.id}`)}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      {funcionario.ativo && (
                        <button
                          onClick={() => handleInativar(funcionario.id)}
                          className="btn-action btn-inactive"
                          title="Inativar"
                        >
                          🚫
                        </button>
                      )}
                      <button
                        onClick={() => confirmDelete(funcionario)}
                        className="btn-action btn-delete"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar Exclusão</h2>
            <p>
              Tem certeza que deseja excluir o funcionário{' '}
              <strong>{funcionarioToDelete?.nome}</strong>?
            </p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFuncionarioToDelete(null);
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(funcionarioToDelete.id)}
                className="btn btn-danger"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionarioList;
