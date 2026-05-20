/** Valores enviados à API (alinhados a auth.schemas.ts) */

export const ACESSO_MEDICACOES = [
  { value: 'sim', label: 'Sim' },
  {
    value: 'nao_nao_quero',
    label: 'Não porque não quero tomar todos os remédios',
  },
  {
    value: 'nao_sem_recursos',
    label: 'Não porque não tenho recursos para comprar todos os remédios',
  },
];

export const TERAPIAS = [
  { value: 'sim_todas_recomendadas', label: 'Sim, faço todas as terapias recomendadas pelos médicos' },
  {
    value: 'sim_parcialmente_tempo',
    label: 'Sim, mas faço parcialmente as terapias recomendadas pelos médicos por falta de tempo',
  },
  {
    value: 'sim_parcialmente_dinheiro',
    label: 'Sim, mas faço parcialmente as terapias recomendadas pelos médicos por falta de dinheiro',
  },
  { value: 'nao_nao_quero', label: 'Não faço porque não quero' },
  { value: 'nao_sem_dinheiro', label: 'Não faço porque não tenho dinheiro' },
];

export const COR_RACA = [
  { value: 'preto', label: 'Preto' },
  { value: 'pardo', label: 'Pardo' },
  { value: 'branca', label: 'Branca' },
  { value: 'amarela', label: 'Amarela' },
];

export const GENERO = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outro', label: 'Outro (especifique abaixo)' },
  { value: 'prefiro_nao_dizer', label: 'Prefiro não dizer' },
];

export const ESCOLARIDADE = [
  { value: 'ensino_basico_1_4', label: 'Ensino básico (1ª a 4ª série)' },
  { value: 'ensino_fundamental_5_9', label: 'Ensino fundamental (5ª a 9ª série)' },
  { value: 'ensino_medio', label: 'Ensino médio (colegial)' },
  { value: 'graduacao_curso_ou_completa', label: 'Graduação completa ou em curso' },
  { value: 'pos_graduacao_curso_ou_completa', label: 'Pós-graduação completa ou em curso' },
];

export const COM_QUEM_MORA = [
  { value: 'sozinho', label: 'Sozinho' },
  {
    value: 'pais_parentes',
    label: 'Com meus pais, irmãos ou outros parentes',
  },
  { value: 'amigos_colegas', label: 'Com amigos ou colegas' },
  {
    value: 'parceiro_romantico',
    label:
      'Com meu parceiro romântico (namorado(a); noivo(a); esposo(a); companheiro(a))',
  },
];

export const SITUACAO_TRABALHO = [
  { value: 'clt', label: 'Sim, trabalho CLT' },
  { value: 'autonomo_empreendedor', label: 'Sim, sou autônomo ou empreendedor' },
  { value: 'nao', label: 'Não' },
];

export const NIVEL_RENDA = [
  { value: 'sem_renda', label: 'No momento não possuo renda' },
  { value: 'bolsa_familia_bpc', label: 'No momento recebo Bolsa Família ou BPC-LOAS' },
  { value: 'ate_1_sm', label: 'Até 1 salário mínimo (R$ 1627)' },
  { value: 'ate_2_sm', label: 'Até 2 salários mínimos (R$ 3254)' },
  { value: 'ate_3_sm', label: 'Até 3 salários mínimos (R$ 4881)' },
  { value: 'mais_3_sm', label: 'Mais do que 3 salários mínimos (R$ 4881)' },
];

export const PENSAMENTOS_SUICIDIO = [
  { value: 'nunca', label: 'Nunca' },
  {
    value: 'pensamento_breve',
    label: 'Tive apenas um pensamento, e foi breve',
  },
  {
    value: 'plano_sem_tentativa',
    label:
      'Ao menos uma vez, já cheguei até a fazer um plano, mas não tentei executá-lo',
  },
  {
    value: 'plano_pensou_executar',
    label:
      'Ao menos uma vez, já cheguei a planejar e nessa ocasião eu pensei em morrer executando o plano',
  },
  {
    value: 'tentativa_parar_dor',
    label:
      'Já tentei me suicidar, mas não porque eu queria de fato morrer e sim porque eu queria parar de sentir dor',
  },
  {
    value: 'tentativa_queria_morrer',
    label:
      'Já tentei me suicidar e nessa ocasião eu realmente queria morrer',
  },
];

export const FREQUENCIA_SUICIDIO_12M = [
  { value: 'nunca', label: 'Nunca' },
  { value: 'raramente', label: 'Raramente' },
  { value: 'as_vezes', label: 'Às vezes' },
  { value: 'frequentemente', label: 'Frequentemente' },
  { value: 'muito_frequentemente', label: 'Muito frequentemente' },
];
