import { useNavigate } from 'react-router-dom';
import { PageContainer, PageTitle, PageContent, ContentCard, Button } from '../components';

function Home() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageTitle>QUESTIONÁRIO</PageTitle>
      
      <PageContent>
        <ContentCard>
          <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed text-center">
            Este questionário foi criado como parte do projeto de conclusão de curso 
            da Priscilla e pretende ajudar adultos no espectro autista a identificar e compreender os seus traços de forma melhor. 
            O objetivo é que seja possível reconhecer suas características únicas para as trabalhar ou as potencializar. 
            O formulário tem 155 etapas; em algumas delas (da 50 à 94, as que mencionam "hotlink") você pode passar o mouse sobre 
            o conteúdo da etapa para ver mais detalhes e definições. Responda cada etapa imaginando-se na situação descrita.
            <br /><br />
            Quando se sentir pronto(a), clique em "Próximo" para começar a sua jornada de autoconhecimento. 
          </p>
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

