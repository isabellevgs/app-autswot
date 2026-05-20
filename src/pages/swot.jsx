import { PageContainer, SectionHeader, ContentCard } from '../components';
import { useSwot } from '../hooks/useSwot';
import SwotLoading from '../components/swot/SwotLoading';
import SwotError from '../components/swot/SwotError';
import SwotGrid from '../components/swot/SwotGrid';

const introP =
  'font-serif text-gray-900 text-base sm:text-lg leading-relaxed text-justify';

function Swot() {
  const { dadosSwot, progresso, loading, error, refreshProgresso } = useSwot();

  if (loading) {
    return <SwotLoading />;
  }

  if (error) {
    return <SwotError error={error} />;
  }

  return (
    <PageContainer className="pb-12">
      <SectionHeader title="Resultados" />

      <div className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-32">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          <ContentCard className="space-y-4" hover={false} shadow={false}>
          <p className={introP}>
            A seguir, você terá acesso à sua SWOT autística e nela, você encontrara todos os seus
            traços classificados em: forças, fraquezas, oportunidades e ameaças.
          </p>
          <p className={introP}>
            Como só conhecer seus traços autísticos não é suficiente para construir seu
            autoconhecimento, autonomia e promover seus bem-estar, é necessário aprender sobre como
            seus traços podem impactar positivamente ou negativamente na sua vida, refletir sobre
            formas de superar as dificuldades causadas por traços que lhe prejudicam e, de como
            transformar alguns traços em forças autísticas.
          </p>
          <p className={introP}>
            Essa aprendizagem envolve reflexões profundas e graduais, por isso, inicialmente, apenas
            o quadrante de ameaças será disponibilizado. Nele, você poderá visualizar seus traços,
            acompanhados de explicações claras sobre o que são, como podem se manifestar na vida
            adulta, quais impactos podem gerar e quais necessidades específicas podem estar
            associadas a eles.
          </p>
          <p className={introP}>
            Você também visualizará perguntas de reflexão que devem ser respondidas. Depois de
            concluir a leitura você deverá responder perguntas de autoreflexao que poderão te ajudar
            a delinear suas necessidades especificas e estratégias de enfrentamento. Somente depois
            de concluir o exercício dos traços de ameaças, o quadrante de fraquezas será
            automaticamente aberto. A mesma dinâmica se repetirá nos quadrantes de oportunidades e,
            por fim, de forças autísticas.
          </p>
          <p className={introP}>
            Em cada quadrante, você encontrará perguntas que o(a) convidam a refletir profundamente
            sobre suas experiências e necessidades. Essa reflexão é essencial, pois é ela que permite
            identificar suas necessidades específicas, ou seja, aquilo de que você realmente precisa
            para evitar ou minimizar o prejuízo que um traço pode lhe causar. Isso pode significar,
            por exemplo, solicitar ao seu ambiente de trabalho, estudo ou lar a possibilidade de
            prover ou ajudar a desenvolver as adaptações necessárias.
          </p>
          <p className={introP}>
            Com base nas explicações e nas dicas apresentadas pela plataforma, somadas ao que você
            aprendeu na etapa de treinamento sobre identificação de necessidades específicas e
            autoadvocacia, você poderá construir suas próprias estratégias de enfrentamento,
            adequadas ao seu contexto e ao seu perfil autístico. Caso, em algum momento, você sinta
            dificuldade em elaborar uma estratégia para um traço específico, você pode solicitar
            ajuda contatando diretamente à pesquisadora. Ao concluir a reflexão e responder as
            perguntas de todos os quadrantes, você visualizará sua SWOT com todos os traços
            classificados e as perguntas e respostas dos seus exercícios. você poderá salvar os
            resultados em PDF. Caso não consiga por algum motivo, deverá entrar em contato com a
            pesquisadora principal solicitando o relatório final. Após alguns dias, você receberá
            seu relatório completo de perfil autístico, contendo todos os seus traços classificados,
            explicados e acompanhados das necessidades específicas que você identificou e das
            estratégias de enfrentamento que você desenvolveu.
          </p>
          </ContentCard>

          <SwotGrid
            dadosSwot={dadosSwot}
            progresso={progresso}
            onProgressoChange={refreshProgresso}
          />
        </div>
      </div>
    </PageContainer>
  );
}

export default Swot;
