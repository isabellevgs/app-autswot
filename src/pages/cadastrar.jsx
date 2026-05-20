import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout, Input, PasswordInput, Button } from '../components';
import TermosModal from '../components/ui/termosModal';
import {
  ACESSO_MEDICACOES,
  TERAPIAS,
  COR_RACA,
  GENERO,
  ESCOLARIDADE,
  COM_QUEM_MORA,
  SITUACAO_TRABALHO,
  NIVEL_RENDA,
  PENSAMENTOS_SUICIDIO,
  FREQUENCIA_SUICIDIO_12M,
} from '../constants/registrationOptions';

const SIM_NAO = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

const selectClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white text-gray-900';

const labelClass = 'block text-gray-900 font-semibold mb-2';

function FormSelect({ id, label, value, onChange, options, required }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        className={selectClass}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled>
          Selecione…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormTextarea({ id, label, value, onChange, required, rows = 4, placeholder = '' }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={selectClass}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

const initialForm = {
  nomeCompleto: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  especialistaIndicacao: '',
  diagnosticadoTea: '',
  outrasCondicoesSaude: '',
  outrasCondicoesDetalhe: '',
  acessoMedicacoes: '',
  terapiasNaoMedicamentosas: '',
  idade: '',
  corRaca: '',
  genero: '',
  generoOutroTexto: '',
  profissao: '',
  escolaridade: '',
  comQuemMora: '',
  situacaoTrabalho: '',
  auxilioGovernoExperiencia: '',
  nivelRenda: '',
  burnout: '',
  burnoutDescricao: '',
  pensamentosSuicidio: '',
  frequenciaSuicidio12meses: '',
  contouSuicidioOuBarreiras: '',
  probabilidadeSuicidioFuturoExplicacao: '',
  aceitouTermos: false,
};

function Cadastrar() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [erro, setErro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErro('');
  };

  const validarCondicionais = () => {
    if (formData.outrasCondicoesSaude === 'sim' && !formData.outrasCondicoesDetalhe.trim()) {
      setErro('Informe quais outras condições (ou use o campo para detalhar em "outro").');
      return false;
    }
    if (formData.genero === 'outro' && !formData.generoOutroTexto.trim()) {
      setErro('Descreva como você se identifica no campo de gênero (outro).');
      return false;
    }
    if (formData.burnout === 'sim' && !formData.burnoutDescricao.trim()) {
      setErro('Descreva sua experiência com burnout.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    if (!formData.aceitouTermos) {
      setErro('Você precisa aceitar os termos de uso para criar uma conta.');
      return;
    }

    if (!validarCondicionais()) {
      return;
    }

    const payload = {
      name: formData.nomeCompleto.trim(),
      email: formData.email.trim(),
      password: formData.senha,
      especialistaIndicacao: formData.especialistaIndicacao.trim(),
      diagnosticadoTea: formData.diagnosticadoTea,
      outrasCondicoesSaude: formData.outrasCondicoesSaude,
      outrasCondicoesDetalhe: formData.outrasCondicoesDetalhe.trim(),
      acessoMedicacoes: formData.acessoMedicacoes,
      terapiasNaoMedicamentosas: formData.terapiasNaoMedicamentosas,
      idade: formData.idade.trim(),
      corRaca: formData.corRaca,
      genero: formData.genero,
      generoOutroTexto: formData.generoOutroTexto.trim(),
      profissao: formData.profissao.trim(),
      escolaridade: formData.escolaridade,
      comQuemMora: formData.comQuemMora,
      situacaoTrabalho: formData.situacaoTrabalho,
      auxilioGovernoExperiencia: formData.auxilioGovernoExperiencia.trim(),
      nivelRenda: formData.nivelRenda,
      burnout: formData.burnout,
      burnoutDescricao: formData.burnoutDescricao.trim(),
      pensamentosSuicidio: formData.pensamentosSuicidio,
      frequenciaSuicidio12meses: formData.frequenciaSuicidio12meses,
      contouSuicidioOuBarreiras: formData.contouSuicidioOuBarreiras.trim(),
      probabilidadeSuicidioFuturoExplicacao: formData.probabilidadeSuicidioFuturoExplicacao.trim(),
    };

    try {
      await register(payload);
      navigate('/');
    } catch (err) {
      console.error('Falha no cadastro', err);
      setErro(err.message || 'Erro ao criar conta. Tente novamente!');
    }
  };

  return (
    <AuthLayout title="Criar Conta" wide>
      <form onSubmit={handleSubmit} className="space-y-6">
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {erro}
          </div>
        )}

        <section className="space-y-4 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-bold text-gray-900">Acesso à conta</h2>
          <Input
            label="Nome"
            type="text"
            value={formData.nomeCompleto}
            onChange={(e) => handleChange('nomeCompleto', e.target.value)}
            required
          />
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
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirmar senha"
            value={formData.confirmarSenha}
            onChange={(value) => handleChange('confirmarSenha', value)}
            required
            autoComplete="new-password"
          />
        </section>

        <section className="space-y-4 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-bold text-gray-900">Indicação e saúde</h2>
          <Input
            label="Nome do especialista/pesquisador que indicou"
            type="text"
            value={formData.especialistaIndicacao}
            onChange={(e) => handleChange('especialistaIndicacao', e.target.value)}
            required
          />
          <FormSelect
            id="diagnosticadoTea"
            label="Você foi diagnosticado com o Transtorno do Espectro Autista?"
            value={formData.diagnosticadoTea}
            onChange={(e) => handleChange('diagnosticadoTea', e.target.value)}
            options={SIM_NAO}
            required
          />
          <FormSelect
            id="outrasCondicoes"
            label="Você tem diagnóstico de outras condições de saúde?"
            value={formData.outrasCondicoesSaude}
            onChange={(e) => handleChange('outrasCondicoesSaude', e.target.value)}
            options={SIM_NAO}
            required
          />
          <FormTextarea
            id="outrasCondicoesDetalhe"
            label='Se sim, indique quais (use "outro" se preferir detalhar)'
            value={formData.outrasCondicoesDetalhe}
            onChange={(e) => handleChange('outrasCondicoesDetalhe', e.target.value)}
            required={formData.outrasCondicoesSaude === 'sim'}
            rows={3}
          />
          <FormSelect
            id="acessoMedicacoes"
            label="Você tem acesso a todas as medicações necessárias para os seus tratamentos?"
            value={formData.acessoMedicacoes}
            onChange={(e) => handleChange('acessoMedicacoes', e.target.value)}
            options={ACESSO_MEDICACOES}
            required
          />
          <FormSelect
            id="terapias"
            label="Você faz terapias não medicamentosas como Psicoterapia com psicólogo ou Terapia Ocupacional?"
            value={formData.terapiasNaoMedicamentosas}
            onChange={(e) => handleChange('terapiasNaoMedicamentosas', e.target.value)}
            options={TERAPIAS}
            required
          />
        </section>

        <section className="space-y-4 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-bold text-gray-900">Dados pessoais</h2>
          <Input
            label="Idade"
            type="text"
            value={formData.idade}
            onChange={(e) => handleChange('idade', e.target.value)}
            required
          />
          <FormSelect
            id="corRaca"
            label="Como você se identifica (cor/raça)?"
            value={formData.corRaca}
            onChange={(e) => handleChange('corRaca', e.target.value)}
            options={COR_RACA}
            required
          />
          <FormSelect
            id="genero"
            label="Com que gênero você se identifica?"
            value={formData.genero}
            onChange={(e) => handleChange('genero', e.target.value)}
            options={GENERO}
            required
          />
          {formData.genero === 'outro' && (
            <Input
              label="Especifique o gênero"
              type="text"
              value={formData.generoOutroTexto}
              onChange={(e) => handleChange('generoOutroTexto', e.target.value)}
              required
            />
          )}
          <Input
            label="Profissão"
            type="text"
            value={formData.profissao}
            onChange={(e) => handleChange('profissao', e.target.value)}
            required
          />
          <FormSelect
            id="escolaridade"
            label="Qual é o seu nível de escolaridade formal?"
            value={formData.escolaridade}
            onChange={(e) => handleChange('escolaridade', e.target.value)}
            options={ESCOLARIDADE}
            required
          />
        </section>

        <section className="space-y-4 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-bold text-gray-900">Moradia, trabalho e renda</h2>
          <FormSelect
            id="comQuemMora"
            label="Com quem você mora?"
            value={formData.comQuemMora}
            onChange={(e) => handleChange('comQuemMora', e.target.value)}
            options={COM_QUEM_MORA}
            required
          />
          <FormSelect
            id="situacaoTrabalho"
            label="Atualmente, você trabalha?"
            value={formData.situacaoTrabalho}
            onChange={(e) => handleChange('situacaoTrabalho', e.target.value)}
            options={SITUACAO_TRABALHO}
            required
          />
          <FormTextarea
            id="auxilioGoverno"
            label="Você tentou receber algum tipo de auxílio financeiro do governo como o Bolsa Família e o BPC-LOAS? Se sim, diga se você conseguiu e conte como foi sua experiência durante o processo de solicitação"
            value={formData.auxilioGovernoExperiencia}
            onChange={(e) => handleChange('auxilioGovernoExperiencia', e.target.value)}
            required
            rows={4}
          />
          <FormSelect
            id="nivelRenda"
            label="Qual o seu nível de renda?"
            value={formData.nivelRenda}
            onChange={(e) => handleChange('nivelRenda', e.target.value)}
            options={NIVEL_RENDA}
            required
          />
        </section>

        <section className="space-y-4 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-bold text-gray-900">Saúde mental e bem-estar</h2>
          <FormSelect
            id="burnout"
            label="Você já teve burnout?"
            value={formData.burnout}
            onChange={(e) => handleChange('burnout', e.target.value)}
            options={SIM_NAO}
            required
          />
          {formData.burnout === 'sim' && (
            <FormTextarea
              id="burnoutDesc"
              label="Se sim, descreva como foi (por exemplo, perda de habilidades, consequências, como melhorou)"
              value={formData.burnoutDescricao}
              onChange={(e) => handleChange('burnoutDescricao', e.target.value)}
              required
              rows={4}
            />
          )}
          <FormSelect
            id="pensamentosSuicidio"
            label="Você já teve pensamentos relacionados a suicídio?"
            value={formData.pensamentosSuicidio}
            onChange={(e) => handleChange('pensamentosSuicidio', e.target.value)}
            options={PENSAMENTOS_SUICIDIO}
            required
          />
          <FormSelect
            id="frequenciaSuicidio"
            label="Nos últimos 12 meses, com que frequência você teve pensamentos sobre tirar a própria vida?"
            value={formData.frequenciaSuicidio12meses}
            onChange={(e) => handleChange('frequenciaSuicidio12meses', e.target.value)}
            options={FREQUENCIA_SUICIDIO_12M}
            required
          />
          <FormTextarea
            id="contouSuicidio"
            label="Você já contou ou mencionou a outra pessoa que pretendia tirar a própria vida ou que pensou em fazer isso? Se sim, escreva para quem e como foi. Se não, liste e explique as barreiras"
            value={formData.contouSuicidioOuBarreiras}
            onChange={(e) => handleChange('contouSuicidioOuBarreiras', e.target.value)}
            required
            rows={5}
          />
          <FormTextarea
            id="probabilidadeFuturo"
            label="No momento atual, indique e explique qual a probabilidade de você pensar ou de fato tentar tirar a própria vida em algum momento no futuro"
            value={formData.probabilidadeSuicidioFuturoExplicacao}
            onChange={(e) =>
              handleChange('probabilidadeSuicidioFuturoExplicacao', e.target.value)
            }
            required
            rows={5}
          />
        </section>

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

        <Button type="submit" fullWidth size="lg" className="uppercase mt-2">
          Criar Conta
        </Button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-700">Já tem uma conta? </span>
        <Link
          to="/login"
          className="text-violet-700 hover:text-violet-800 font-semibold transition-colors underline"
        >
          Fazer login
        </Link>
      </div>

      <TermosModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AuthLayout>
  );
}

export default Cadastrar;
