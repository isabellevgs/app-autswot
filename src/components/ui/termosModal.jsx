// Modal para exibir os Termos de Consentimento Livre e Esclarecido

function TermosModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay com backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
          TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Fechar modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-gray max-w-none space-y-4 text-sm sm:text-base">
            <p className="text-gray-700 leading-relaxed font-bold">
              Prezado(a) senhor(a),
            </p>

            <p className="text-gray-700 leading-relaxed">
              Você está sendo convidado(a) a participar, como voluntário(a), da pesquisa <strong>AutSWOT: uma ferramenta tecnológica para a aprendizagem de traços autísticos e necessidades específicos para construção da autonomia de adultos autistas</strong>. Essa pesquisa tem como objetivo analisar a aprendizagem sobre traços autísticos e necessidades específicas mediada pela plataforma tecnológica AutSWOT desenvolvida para ajudar na construção da autonomia do adulto autista. Ela está vinculada ao Programa de Pós-Graduação em Sistemas e Processos Industriais (PPGSPI) da Universidade de Santa Cruz do Sul - UNISC e do Programa de Pós-Graduação em Informática na Educação da Universidade Federal do Rio Grande do Sul. Os pesquisadores responsáveis por esta pesquisa são: <strong>Daniela Duarte da Silva Bagatini</strong> (Doutora em Informática na Educação pela UFRGS) - Professora do Departamento de Engenharias, Arquitetura e Computação e do Programa de Pós-Graduação em Sistemas e Processos Industriais (PPGSPI) da UNISC e <strong>Priscila Ferreira Beni</strong> doutoranda do Programa de Pós-Graduação em Informática na Educação. As pesquisadoras poderão ser contatadas qualquer tempo através dos números <strong>(51) 98121-9694</strong> e <strong>(51) 99697-9484</strong> e dos e-mails <strong>bagatini@unisc.br</strong> e <strong>priscila.beni.phd@gmail.com</strong>
            </p>

            <p className="text-gray-700 leading-relaxed">
              Sua participação será possível por atender aos critérios de inclusão estabelecidos na pesquisa, que envolvem o diagnóstico formal de Transtorno do Espectro Autista (TEA) e a indicação por um profissional especialista. A pesquisa ocorrerá entre <strong>1º de janeiro de 2026 e 1º de julho de 2028</strong>.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Durante a pesquisa, você pode ter dúvidas ou preocupações sobre a forma como seus dados serão coletados e utilizados. Para minimizar qualquer desconforto e garantir a transparência quanto ao uso dos dados, acompanha anexo a este Termo de Consentimento Livre e Esclarecido o Termo de Condições de Uso e a Política de Privacidade do sistema. Esses documentos, descrevem de forma clara as finalidades e os procedimentos relacionados ao uso das informações, em conformidade com a Lei Geral de Proteção de Dados (LGPD). A sua participação trará benefícios do ponto de vista científico, pois contribui para a promoção da autonomia de autistas adultos. Os resultados da pesquisa podem ajudar a melhorar a qualidade de vida de autistas adultos.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Para sua participação nessa pesquisa você não terá nenhuma despesa com transporte, alimentação, exames, materiais a serem utilizados ou despesas de qualquer natureza.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Eu, declaro que fui informado(a) de forma clara e completa sobre esta pesquisa. Compreendi os objetivos, os procedimentos, os riscos, os benefícios e os meus direitos como participante. Por isso, autorizo minha participação de forma livre e espontânea, sem qualquer tipo de pressão ou obrigação. Ademais, declaro que, quando for o caso, autorizo a utilização de minha imagem e voz de forma gratuita pelo pesquisador, em quaisquer meios de comunicação, para fins de publicação e divulgação da pesquisa, desde que eu não possa ser identificado através desses instrumentos (imagem e voz).
            </p>

            <p className="text-gray-700 leading-relaxed">
              Fui, igualmente, informado(a):
            </p>

            <div className="space-y-3 ml-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>a)</strong> da garantia de receber resposta a qualquer pergunta ou esclarecimento a qualquer dúvida acerca dos procedimentos, riscos, benefícios e outros assuntos relacionados com a pesquisa;
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>b)</strong> da liberdade de retirar meu consentimento, a qualquer momento, e deixar de participar do estudo, sem que isto traga prejuízo à continuação de meu cuidado e tratamento;
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>c)</strong> da garantia de que não serei identificado quando da divulgação dos resultados e que as informações obtidas serão utilizadas apenas para fins científicos vinculados ao presente projeto de pesquisa;
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>d)</strong> do compromisso de proporcionar informação atualizada obtida durante o estudo; ainda que esta possa afetar a minha vontade em continuar participando;
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              O Comitê de Ética em Pesquisa responsável pela apreciação do projeto pode ser consultado, para fins de esclarecimento, através do seguinte endereço: <strong>Av. Independência, 2293, Bloco 13 - Sala 1306</strong>; ou pelo telefone <strong>(51) 3717-7680</strong>; ou pelo e-mail <strong>cep@unisc.br</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-2 border-violet-700 text-violet-700 hover:bg-violet-50 font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermosModal;

