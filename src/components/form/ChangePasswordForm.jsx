import { useState } from 'react';
import { Lock, Save, X } from 'lucide-react';
import PasswordInput from './PasswordInput';
import Button from '../ui/Button';
import { changePassword } from '../../services/authService';

function ChangePasswordForm({ onCancel }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
    setPasswordError('');
  };

  const handleSavePassword = async () => {
    // Validações
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Todos os campos são obrigatórios');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    setIsSavingPassword(true);
    setPasswordError('');

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      let errorMessage = 'Erro ao alterar senha. Verifique a senha atual.';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      'Erro ao alterar senha. Verifique a senha atual.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setPasswordError(errorMessage);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };

  if (!showPasswordForm) {
    return (
      <Button 
        variant="outline"
        fullWidth
        onClick={() => setShowPasswordForm(true)}
        className="flex items-center justify-center gap-2"
      >
        <Lock className="w-5 h-5" />
        Trocar Senha
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <PasswordInput
        label="Senha Atual"
        value={passwordData.currentPassword}
        onChange={(value) => handlePasswordChange('currentPassword', value)}
        placeholder="Digite sua senha atual"
        required
        hasError={!!passwordError}
        error={passwordError}
      />

      <PasswordInput
        label="Nova Senha"
        value={passwordData.newPassword}
        onChange={(value) => handlePasswordChange('newPassword', value)}
        placeholder="Digite sua nova senha"
        required
      />

      <PasswordInput
        label="Confirmar Nova Senha"
        value={passwordData.confirmPassword}
        onChange={(value) => handlePasswordChange('confirmPassword', value)}
        placeholder="Confirme sua nova senha"
        required
      />

      <div className="flex gap-3 pt-2">
        <Button 
          onClick={handleSavePassword}
          variant="success"
          fullWidth
          disabled={isSavingPassword}
          className="flex items-center justify-center gap-2"
        >
          {isSavingPassword ? (
            <>Aguarde...</>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={handleCancelPassword}
          disabled={isSavingPassword}
          className="flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export default ChangePasswordForm;

