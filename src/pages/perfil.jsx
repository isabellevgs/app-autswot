import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ProfileHeader, 
  SectionCard, 
  FormInput, 
  Button,
  ChangePasswordForm
} from '../components';

function Perfil() {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    nomeCompleto: user?.name || '',
    email: user?.email || ''
  });
  
  const [editData, setEditData] = useState({ ...userData });

  // Atualizar userData quando o user mudar
  useEffect(() => {
    if (user) {
      setUserData({
        nomeCompleto: user.name || '',
        email: user.email || ''
      });
      setEditData({
        nomeCompleto: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    // Validação
    if (!editData.nomeCompleto.trim()) {
      setError('O nome é obrigatório');
      return;
    }

    setIsSaving(true);

    try {
      // Chamar a API para salvar
      const updatedUser = await updateUserProfile({ name: editData.nomeCompleto });
      
      // Atualizar estado local com os dados retornados
      if (updatedUser) {
        setUserData({
          nomeCompleto: updatedUser.name || editData.nomeCompleto,
          email: updatedUser.email || userData.email
        });
        setEditData({
          nomeCompleto: updatedUser.name || editData.nomeCompleto,
          email: updatedUser.email || userData.email
        });
      } else {
        // Fallback: usar os dados editados
        setUserData({ ...editData });
      }
      
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ProfileHeader 
          title="Perfil"
          description="Gerencie suas informações pessoais e configurações"
        />

        <div className="space-y-6">
          {/* Seção: Informações Pessoais */}
          <SectionCard
            icon={User}
            title="Informações Pessoais"
            description="Atualize seus dados pessoais aqui"
          >
            {/* Mensagens de feedback */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm mb-4">
                {success}
              </div>
            )}

            <div className="space-y-5">
              <FormInput
                label="Nome Completo"
                value={isEditing ? editData.nomeCompleto : userData.nomeCompleto}
                onChange={(value) => handleChange('nomeCompleto', value)}
                icon={User}
                disabled={!isEditing || isSaving}
                placeholder="Seu nome completo"
              />

              <FormInput
                label="E-mail"
                type="email"
                value={userData.email}
                icon={Mail}
                disabled
                placeholder="seu@email.com"
                helperText="O e-mail não pode ser alterado"
              />
            </div>

            {/* Botões de Ação */}
            {!isEditing ? (
              <div className="mt-6 flex gap-3">
                <Button onClick={handleEdit}>
                  Editar Informações
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={handleSave}
                  variant="success"
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </Button>
              </div>
            )}
          </SectionCard>

          {/* Seção: Segurança */}
          <SectionCard
            icon={Lock}
            title="Segurança"
            description="Gerencie sua senha e configurações de segurança"
          >
            <ChangePasswordForm />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
