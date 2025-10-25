import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { funcionarioService } from '../../services/api';
import '../CSS/Funcionario.css';

const FuncionarioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    departamento: '', // DepartamentoEnum
    turno: '', // TurnoEnum
    ativo: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadFuncionario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadFuncionario = async () => {
    try {
      setLoading(true);
      const data = await funcionarioService.getById(id);
      // Mapeia campos do backend para o frontend, independente de maiúsculas/minúsculas
      setFormData({
        nome: data?.nome || data?.Nome || '',
        sobrenome: data?.sobrenome || data?.Sobrenome || '',
        departamento: data?.departamento || data?.Departamento || 'RH',
        turno: data?.turno || data?.Turno || 'Manha',
        ativo: typeof data?.ativo === 'boolean' ? data.ativo : (typeof data?.Ativo === 'boolean' ? data.Ativo : true),
      });
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      setApiError('Erro ao carregar dados do funcionário');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter no mínimo 2 caracteres';
    }

    if (!formData.sobrenome?.trim()) {
      newErrors.sobrenome = 'Sobrenome é obrigatório';
    } else if (formData.sobrenome.trim().length < 2) {
      newErrors.sobrenome = 'Sobrenome deve ter no mínimo 2 caracteres';
    }

    if (!formData.departamento) {
      newErrors.departamento = 'Departamento é obrigatório';
    }

    if (!formData.turno) {
      newErrors.turno = 'Turno é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        departamento: formData.departamento,
        turno: formData.turno,
        ativo: formData.ativo,
      };

      if (isEdit) {
        dataToSend.id = parseInt(id);
        await funcionarioService.update(dataToSend);
        setSuccessMessage('Funcionário atualizado com sucesso!');
      } else {
        await funcionarioService.create(dataToSend);
        setSuccessMessage('Funcionário cadastrado com sucesso!');
      }

      setTimeout(() => {
        navigate('/funcionarios');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      setApiError(
        typeof error === 'string'
          ? error
          : error.message || 'Erro ao salvar funcionário. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="funcionario-container">
      <div className="funcionario-form-card">
        <div className="form-header">
          <h1>{isEdit ? 'Editar Funcionário' : 'Novo Funcionário'}</h1>
          <button onClick={() => navigate('/funcionarios')} className="btn btn-secondary">
            ← Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="funcionario-form">
          {apiError && <div className="alert alert-error">{apiError}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? 'error' : ''}
                placeholder="João"
                disabled={loading}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sobrenome">Sobrenome *</label>
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                className={errors.sobrenome ? 'error' : ''}
                placeholder="Silva"
                disabled={loading}
              />
              {errors.sobrenome && <span className="error-message">{errors.sobrenome}</span>}
            </div>
          </div>

          <div className="form-row select-row">
            <div className="form-group select-group">
              <label htmlFor="departamento">Departamento *</label>
              <div className="select-icon-wrapper">
                <span className="select-icon" role="img" aria-label="departamento">🏢</span>
                <select
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className={errors.departamento ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="RH">RH</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Compras">Compras</option>
                  <option value="Atendimento">Atendimento</option>
                  <option value="Zeladoria">Zeladoria</option>
                </select>
              </div>
              {errors.departamento && <span className="error-message">{errors.departamento}</span>}
            </div>

            <div className="form-group select-group">
              <label htmlFor="turno">Turno *</label>
              <div className="select-icon-wrapper">
                <span className="select-icon" role="img" aria-label="turno">⏰</span>
                <select
                  id="turno"
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  className={errors.turno ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="Manha">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>
              {errors.turno && <span className="error-message">{errors.turno}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Funcionário Ativo</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/funcionarios')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuncionarioForm;
