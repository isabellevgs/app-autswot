import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout, Input, PasswordInput, Button } from '../components';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.senha);
      navigate('/');
    } catch (err) {
      console.error('Falha no login', err);
      setErro('Credenciais inválidas. Tente novamente!');
    }
  };

  return (
    <AuthLayout title="AutSWOT" subtitle="Bem-vindo">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {erro}
          </div>
        )}

        {/* E-mail */}
        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />

        <PasswordInput
          label="Senha"
          value={formData.senha}
          onChange={(value) => handleChange('senha', value)}
          required
          autoComplete="current-password"
        />

        {/* Botão Entrar */}
        <Button type="submit" fullWidth size="lg" className="uppercase">
          Entrar
        </Button>
      </form>

      {/* Link para criar conta */}
      <div className="text-center mt-6">
        <span className="text-gray-700">Não tem uma conta? </span>
        <Link
          to="/cadastrar"
          className="text-violet-700 hover:text-violet-800 font-semibold transition-colors underline"
        >
          Criar conta
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Login;

