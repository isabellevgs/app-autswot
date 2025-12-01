import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout, Input, Button } from '../components';
import TermosModal from '../components/ui/termosModal';

function Cadastrar() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitouTermos: false
  });
  const [erro, setErro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações locais
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    if (!formData.aceitouTermos) {
      setErro('Você precisa aceitar os termos de uso para criar uma conta.');
      return;
    }

    try {
      // Chama a API de registro
      await register(formData.nomeCompleto, formData.email, formData.senha);
      
      // Redireciona para a home após registro bem-sucedido
      navigate('/');
    } catch (err) {
      console.error('Falha no cadastro', err);
      setErro(err.message || 'Erro ao criar conta. Tente novamente!');
    }
  };

  return (
    <AuthLayout title="Criar Conta">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {erro}
          </div>
        )}

        {/* Nome Completo */}
        <Input
          label="Nome completo"
          type="text"
          value={formData.nomeCompleto}
          onChange={(e) => handleChange('nomeCompleto', e.target.value)}
          required
        />

        {/* E-mail */}
        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />

        {/* Senha */}
        <Input
          label="Senha"
          type="password"
          value={formData.senha}
          onChange={(e) => handleChange('senha', e.target.value)}
          required
        />

        {/* Confirmar Senha */}
        <Input
          label="Confirmar senha"
          type="password"
          value={formData.confirmarSenha}
          onChange={(e) => handleChange('confirmarSenha', e.target.value)}
          required
        />

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="termos"
            checked={formData.aceitouTermos}
            onChange={(e) => handleChange('aceitouTermos', e.target.checked)}
            className="mt-1 w-4 h-4 text-violet-700 border-gray-300 rounded focus:ring-violet-500 cursor-pointer flex-shrink-0"
            required
          />
          <label htmlFor="termos" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="text-violet-700 hover:text-violet-800 font-semibold underline text-left"
            >
              Li e aceito os termos de consentimento livre e esclarecido
            </button>
          </label>
        </div>

        {/* Botão Criar Conta */}
        <Button type="submit" fullWidth size="lg" className="uppercase mt-6">
          Criar Conta
        </Button>
      </form>

      {/* Link para fazer login */}
      <div className="text-center mt-6">
        <span className="text-gray-700">Já tem uma conta? </span>
        <Link
          to="/login"
          className="text-violet-700 hover:text-violet-800 font-semibold transition-colors underline"
        >
          Fazer login
        </Link>
      </div>

      {/* Modal de Termos */}
      <TermosModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </AuthLayout>
  );
}

export default Cadastrar;

