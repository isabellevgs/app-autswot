import { useNavigate } from 'react-router-dom';
import { PageContainer, PageTitle, PageContent, ContentCard, Button } from '../components';

function Home() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageTitle>Seja bem-vindo(a) à AutSWOT</PageTitle>
      
      <PageContent>
        <ContentCard>
          <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed">
            Esta plataforma faz parte da pesquisa “AutSWOT: uma tecnologia assistiva para
            aprendizagem e autonomia de adultos autistas”.
          </p>
          <br/>
          <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed">
            A AutSWOT foi desenhada para ajudar adultos autistas a reconhecer seus traços
            autísticos, identificar necessidades específicas e elaborar estratégias de enfrentamento.
          </p>
          <br/>
          <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed">
            O uso da AutSWOT envolve 4 etapas:
          </p>
          <br/>
          <ol className="list-decimal list-inside text-gray-800 font-medium text-base sm:text-lg leading-relaxed space-y-2 pl-4">
            <li>Visualização de traços autísticos por meio de histórias sociais ou escritos em
                linguagem inclusiva, com exemplos. Para cada traço apresentado, você deverá
                refletir se se reconhece na situação citada e, em caso positivo, deverá indicar a
                frequência e intensidade com que esse traço se manifesta considerando os
                diferentes âmbitos da sua vida (educacional, profissional, relações familiares, de
                amizade e românticas).<br/>
                O preenchimento total leva cerca de 1h30 a 2h, mas você pode avançar no seu
                ritmo, salvar e retornar quando desejar.
            </li>
            <li>A exibição dos seus traços classificados em forças, fraquezas, oportunidades e
                ameaças. 
                <br/>
                A classificação dos traços segue um modelo matemático e conceitual
                desenvolvido e validado por um matemático, médicos, terapeutas, pesquisadores especializados em adultos autistas e também por adultos autistas.<br/>
                Alguns traços aparecerão como ameaças, o que significa que impactam negativamente na sua vida e que, para superar os desafios referentes a eles, você poderá precisar de apoio externo para elaborar estratégias de enfrentamento.
                Os traços classificados como fraquezas são aqueles que podem causar dificuldades, mas que inicialmente podem ser manejados por meio de autoconhecimento.
                Já os traços apresentados como oportunidades são aqueles que, embora atualmente possam estar te prejudicando de alguma forma, se trabalhados têm potencial de se tornar forças autísticas.
                Por fim, serão apresentadas suas forças autísticas: características positivas frequentemente mais acentuadas em pessoas autistas.
                <br/><br/>
                Os traços serão apresentados um por vez dentro do quadrante classificatório
                (ameaças, fraquezas, oportunidades e forças). <br/>
                Além do traço, serão mostradas
                explicações sobre ele, dicas de estratégias de enfrentamento e perguntas
                reflexivas que o(a) ajudarão a identificar suas necessidades específicas e
                elaborar suas próprias estratégias de enfrentamento. Quando você terminar de 
                responder as perguntas reflexivas dos traços de todo um quadrante, o próximo
                quadrante será desbloqueado para que você possa continuar a atividade de reflexão e desenvolvimento de suas estratégias. Após terminar todos os quadrantes você poderá visualizar sua SWOT completa com todos os seus traços classificados.
            </li>
          </ol>
        </ContentCard>
      </PageContent>

      <div className="flex justify-center pb-12">
        <Button 
          onClick={() => navigate('/questionario')}
          size="lg"
          className="hover:scale-105 active:scale-95"
        >
          Próximo
        </Button>
      </div>
    </PageContainer>
  );
}

export default Home;

