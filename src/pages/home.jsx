import { useNavigate } from 'react-router-dom';
import { PageContainer, PageTitle, ContentCard, Button } from '../components';
import { useProgresso } from '../hooks/useProgresso';

/** Bloco com numeração estilo 1) 2) e texto alinhado ao documento (recuo pendente). */
function NumberedBlock({ numberLabel, children }) {
  return (
    <div className="flex gap-2 items-start">
      <span className="shrink-0 font-serif text-gray-900 text-base sm:text-lg leading-relaxed tabular-nums">
        {numberLabel})
      </span>
      <div className="min-w-0 flex-1 font-serif text-gray-900 text-base sm:text-lg leading-relaxed text-justify space-y-4">
        {children}
      </div>
    </div>
  );
}

const BOTAO_CONFIG = {
  nao_iniciado: { label: 'Iniciar questionário',   rota: '/questionario' },
  em_andamento: { label: 'Continuar questionário', rota: '/questionario' },
  concluido:    { label: 'Ver minha SWOT',           rota: '/resultados'   },
};

function Home() {
  const navigate = useNavigate();
  const { status, porcentagem, loading, error, recarregar } = useProgresso();

  const p = 'font-serif text-gray-900 text-base sm:text-lg leading-relaxed text-justify';

  return (
    <PageContainer>
      <PageTitle className="font-serif">Seja bem-vindo(a) à AutSWOT</PageTitle>

      <div className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-32 pb-10">
        <div className="max-w-6xl mx-auto w-full">
        <ContentCard className="space-y-4" hover={false} shadow={false}>
          <p className={p}>
            Esta plataforma faz parte da pesquisa “
            <em className="italic">
              AutSWOT: uma tecnologia assistiva para aprendizagem e autonomia de adultos autistas
            </em>
            ”.
          </p>
          <p className={p}>
            A AutSWOT foi desenhada para ajudar adultos autistas a reconhecerem seus traços
            autísticos, identificar necessidades específicas e elaborar estratégias de enfrentamento.
          </p>
          <p className={p}>O uso da AutSWOT envolve 4 etapas:</p>

          <NumberedBlock numberLabel="1">
            <p>
              Visualização de traços autísticos por meio de histórias sociais ou escritos em
              linguagem inclusiva, com exemplos. Para cada traço apresentado, você deverá
              refletir se se reconhece na situação citada e, em caso positivo, deverá indicar a
              frequência e intensidade com que esse traço se manifesta considerando os
              diferentes âmbitos da sua vida (educacional, profissional, relações familiares, de
              amizade e românticas).
            </p>
            <p>
              O preenchimento total leva cerca de 1h30 a 2h, mas você pode avançar no seu
              ritmo, salvar e retornar quando desejar.
            </p>
          </NumberedBlock>

          <NumberedBlock numberLabel="2">
            <p>
              A exibição dos seus traços classificados em forças, fraquezas, oportunidades e
              ameaças.
            </p>
            <p>
              A classificação dos traços segue um modelo matemático e conceitual desenvolvido e
              validado por um time interdisciplinar, que contou, além da pesquisadora principal
              (que é autista)? matemático, médicos, terapeutas e pesquisadores especializados em
              adultos autistas e também por adultos autistas. Alguns traços aparecerão como
              ameaças, e isso significa que, eles já podem estar impactando negativamente na sua
              vida. Os traços classificados como fraquezas são aqueles que podem causar
              dificuldades, mas que inicialmente não causam perigo eminente.
            </p>
            <p>
              Os traços apresentados como oportunidades são aqueles que, embora atualmente
              possam estar te prejudicando de alguma forma, se trabalhados, eles têm potencial de
              se tornar forças autísticas. Por fim, serão apresentadas suas forças autísticas:
              características positivas frequentemente mais acentuadas em pessoas autistas.
            </p>
            <p>
              Os traços serão apresentados em uma lista dentro do quadrante classificatório
              (ameaças, fraquezas, oportunidades e forças). Além do traço, serão mostradas
              explicações sobre ele, dicas de estratégias de enfrentamento e perguntas reflexivas
              que o(a) ajudarão a identificar suas necessidades específicas e elaborar suas próprias
              estratégias de enfrentamento. Quando você terminar de responder as perguntas
              reflexivas dos traços de um quadrante, o próximo quadrante será desbloqueado para
              que você possa continuar a atividade de reflexão e desenvolvimento de suas
              estratégias. Após terminar todos os quadrantes você poderá visualizar sua SWOT
              completa com todos os seus traços classificados e as respostas dos exercícios de
              reflexão.
            </p>
          </NumberedBlock>

          <NumberedBlock numberLabel="3">
            <p>
              você poderá salvar os resultados em PDF. Caso não consiga por alguma razão, você deve
              notificar a pesquisadora principal. Alguns dias após seu contato, você receberá um
              relatório personalizado do seu perfil autístico, com a sua SWOT completa, todos os
              seus traços explicados, as necessidades específicas identificadas e as estratégias de
              enfrentamento.
            </p>
          </NumberedBlock>

          <NumberedBlock numberLabel="4">
            <p>
              Durante alguns meses você será encorajado a compartilhar seus traços, estratégias e
              autoadvogar pelas suas necessidades específicas descrevendo na seção de Diário como
              tem sido esse processo.
            </p>
          </NumberedBlock>

          <p className={p}>
            Espera-se que, com seu perfil autístico em mãos, você possa se emponderar para
            autoadvogar por suas necessidades específicas nos diversos âmbitos da vida (faculdade,
            trabalho, em casa etc) e assim, possa construir sua autonomia.
          </p>
          <p className={p}>
            Em caso de dúvidas ou necessidade de apoio, você pode contatar a pesquisadora
            principal pelo botão “Contato”, pelo WhatsApp ou por e-mail.
          </p>
          <p className={p}>Obrigada por participar deste estudo.</p>
        </ContentCard>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pb-12 gap-3">
        {!loading && status === 'em_andamento' && porcentagem > 0 && (
          <p className="text-sm text-gray-600">Progresso do questionário: {porcentagem}%</p>
        )}
        {error && (
          <p className="text-sm text-red-600 text-center max-w-md px-4">{error}</p>
        )}
        {error ? (
          <Button
            onClick={recarregar}
            disabled={loading}
            size="lg"
            className="hover:scale-105 active:scale-95"
          >
            {loading ? 'Carregando…' : 'Tentar novamente'}
          </Button>
        ) : (
          <Button
            onClick={() => navigate(BOTAO_CONFIG[status]?.rota || '/questionario')}
            disabled={loading || !status}
            size="lg"
            className="hover:scale-105 active:scale-95"
          >
            {loading ? 'Carregando…' : (BOTAO_CONFIG[status]?.label || 'Carregando…')}
          </Button>
        )}
      </div>
    </PageContainer>
  );
}

export default Home;
