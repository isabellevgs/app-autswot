/** Configuração editorial do relatório exibido nos quadrantes Ameaças e Fraquezas. */

export const ROTULOS_VER_MAIS = {
  atrapalhar: {
    expandir: 'Veja aqui mais exemplos',
    recolher: 'Ver menos',
  },
  dicas: {
    expandir: 'Clique aqui para visualizar mais dicas práticas',
    recolher: 'Ver menos',
  },
  exemplos: {
    expandir: 'Clique aqui para visualizar exemplos práticos',
    recolher: 'Ver menos',
  },
};

export const QUESTOES_AMEACA_FRAQUEZA = [
  {
    id: 'q1',
    min: 40,
    texto: (
      <>
        Escreva abaixo <strong>quando e como</strong> foi a <strong>última vez</strong> que você se lembra deste{' '}
        <strong>traço sendo manifestado</strong>. Pense em um momento recente em que esse traço{' '}
        <strong>dificultou algo</strong> na sua rotina, nos seus estudos, no trabalho ou nos seus relacionamentos.
      </>
    ),
  },
  {
    id: 'q2',
    min: 40,
    texto: (
      <>
        Escreva abaixo as <strong>consequências negativas ou positivas</strong> da situação citada e como você se{' '}
        <strong>sentiu</strong> com relação a elas. Se for difícil escrever seus sentimentos, descreva as emoções que
        apareceram quando as consequências surgiram (raiva, medo, etc.) ou simplesmente os pensamentos que vieram em sua
        mente. Por exemplo, isso impactou prazos? Relacionamentos? Sua saúde mental? Você sentiu frustração, culpa,
        exaustão ou algo parecido?
      </>
    ),
  },
  {
    id: 'q3',
    min: 50,
    hasSubContent: true,
    texto: (
      <>
        Escreva abaixo <strong>o que você pode fazer</strong> para <strong>evitar</strong> que esse traço se manifeste ou
        para <strong>reduzir o impacto negativo</strong> dele. Aqui você deve pensar em atitudes e ações que dependem de
        você, mesmo que envolvam pequenas mudanças.
      </>
    ),
  },
  {
    id: 'q4',
    min: 45,
    hasSubContent: true,
    texto: (
      <>
        Escreva abaixo o que você acha que as <strong>outras pessoas</strong> (professores, chefes, colegas, familiares,
        amigos, parceiros românticos) podem fazer para te dar <strong>apoio e suporte</strong>. Pense nas principais
        situações nas quais esse traço pode te trazer problemas e no que as pessoas do ambiente dessa situação poderiam
        fazer para te ajudar com esse traço, considerando a realidade dela em termos de recursos (tempo, dinheiro,
        disposição etc.).
      </>
    ),
  },
  {
    id: 'q5',
    min: 50,
    hasSubContent: true,
    texto: (
      <>
        Pensando em tudo que você citou nas perguntas acima, qual é a sua{' '}
        <strong>necessidade específica de apoio ou suporte</strong> referente a esse traço? Aqui você deve refletir: Com
        base no que eu escrevi sobre o que eu posso fazer e o que os outros podem me oferecer, qual é a condição
        essencial que precisa existir para que eu consiga lidar melhor com esse traço?
      </>
    ),
  },
  {
    id: 'q6',
    min: 1,
    texto: (
      <>
        O que <strong>você</strong> pode fazer <strong>somado</strong> ao que os <strong>outros</strong> podem fazer, é
        suficiente? Se não for, liste abaixo o que mais seria necessário e que recursos você necessita. Reflita: Se você
        fizesse tudo o que pensou e as pessoas ao seu redor ajudassem também, ainda assim haveria dificuldade? O que mais
        precisa acontecer?
      </>
    ),
  },
  {
    id: 'q7',
    min: 1,
    texto: <>Como você pode conseguir as coisas citadas na questão acima. Liste e explique.</>,
  },
];
