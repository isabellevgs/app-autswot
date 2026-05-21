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
} from './registrationOptions';

export const SIM_NAO = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

export const REGISTRATION_SECTIONS = [
  {
    title: 'Indicação e saúde',
    fields: [
      {
        key: 'especialistaIndicacao',
        label: 'Nome do especialista/pesquisador que indicou',
        type: 'text',
      },
      {
        key: 'diagnosticadoTea',
        label: 'Você foi diagnosticado com o Transtorno do Espectro Autista?',
        options: SIM_NAO,
      },
      {
        key: 'outrasCondicoesSaude',
        label: 'Você tem diagnóstico de outras condições de saúde?',
        options: SIM_NAO,
      },
      {
        key: 'outrasCondicoesDetalhe',
        label: 'Outras condições (detalhe)',
        type: 'text',
        showIf: (d) => d?.outrasCondicoesSaude === 'sim',
      },
      {
        key: 'acessoMedicacoes',
        label: 'Você tem acesso a todas as medicações necessárias para os seus tratamentos?',
        options: ACESSO_MEDICACOES,
      },
      {
        key: 'terapiasNaoMedicamentosas',
        label: 'Você faz terapias não medicamentosas como Psicoterapia com psicólogo ou Terapia Ocupacional?',
        options: TERAPIAS,
      },
    ],
  },
  {
    title: 'Dados pessoais',
    fields: [
      { key: 'idade', label: 'Idade', type: 'text' },
      {
        key: 'corRaca',
        label: 'Como você se identifica (cor/raça)?',
        options: COR_RACA,
      },
      {
        key: 'genero',
        label: 'Com que gênero você se identifica?',
        options: GENERO,
      },
      {
        key: 'generoOutroTexto',
        label: 'Gênero (especificação)',
        type: 'text',
        showIf: (d) => d?.genero === 'outro',
      },
      { key: 'profissao', label: 'Profissão', type: 'text' },
      {
        key: 'escolaridade',
        label: 'Qual é o seu nível de escolaridade formal?',
        options: ESCOLARIDADE,
      },
    ],
  },
  {
    title: 'Moradia, trabalho e renda',
    fields: [
      {
        key: 'comQuemMora',
        label: 'Com quem você mora?',
        options: COM_QUEM_MORA,
      },
      {
        key: 'situacaoTrabalho',
        label: 'Atualmente, você trabalha?',
        options: SITUACAO_TRABALHO,
      },
      {
        key: 'auxilioGovernoExperiencia',
        label: 'Experiência com auxílio financeiro do governo (Bolsa Família, BPC-LOAS)',
        type: 'text',
      },
      {
        key: 'nivelRenda',
        label: 'Qual o seu nível de renda?',
        options: NIVEL_RENDA,
      },
    ],
  },
  {
    title: 'Saúde mental e bem-estar',
    fields: [
      {
        key: 'burnout',
        label: 'Você já teve burnout?',
        options: SIM_NAO,
      },
      {
        key: 'burnoutDescricao',
        label: 'Descrição da experiência com burnout',
        type: 'text',
        showIf: (d) => d?.burnout === 'sim',
      },
      {
        key: 'pensamentosSuicidio',
        label: 'Você já teve pensamentos relacionados a suicídio?',
        options: PENSAMENTOS_SUICIDIO,
      },
      {
        key: 'frequenciaSuicidio12meses',
        label: 'Nos últimos 12 meses, com que frequência você teve pensamentos sobre tirar a própria vida?',
        options: FREQUENCIA_SUICIDIO_12M,
      },
      {
        key: 'contouSuicidioOuBarreiras',
        label: 'Você já contou ou mencionou a outra pessoa sobre pensamentos de tirar a própria vida? Barreiras',
        type: 'text',
      },
      {
        key: 'probabilidadeSuicidioFuturoExplicacao',
        label: 'Probabilidade de pensar ou tentar tirar a própria vida no futuro',
        type: 'text',
      },
    ],
  },
];

export function formatRegistrationAnswer(field, value) {
  if (value == null || String(value).trim() === '') return '—';
  if (field.options) {
    return field.options.find((o) => o.value === value)?.label ?? String(value);
  }
  return String(value);
}

export function getVisibleRegistrationFields(registration) {
  if (!registration) return [];
  return REGISTRATION_SECTIONS.map((section) => ({
    ...section,
    fields: section.fields.filter((field) => !field.showIf || field.showIf(registration)),
  })).filter((section) => section.fields.length > 0);
}
