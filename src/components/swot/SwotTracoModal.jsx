import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api';

// ─── Configuração das questões reflexivas por quadrante ────────────────────

const QUESTOES_AMEACA_FRAQUEZA = [
  {
    id: 'q1',
    min: 80,
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
    min: 60,
    texto: (
      <>
        Escreva abaixo as <strong>consequências negativas ou positivas</strong> da situação citada e como você se{' '}
        <strong>sentiu</strong> com relação a elas. Por exemplo, isso impactou prazos? Relacionamentos? Sua saúde mental?
        Você sentiu frustração, culpa, exaustão ou algo parecido?
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
        para <strong>reduzir o impacto negativo</strong> dele.
      </>
    ),
  },
  {
    id: 'q4',
    min: 45,
    texto: (
      <>
        Escreva abaixo o que você acha que as <strong>outras pessoas</strong> (professores, chefes, colegas, familiares,
        amigos, parceiros românticos) podem fazer para te dar <strong>apoio e suporte</strong>.
      </>
    ),
  },
  {
    id: 'q5',
    min: 50,
    texto: (
      <>
        Pensando em tudo que você citou nas perguntas acima, qual é a sua{' '}
        <strong>necessidade específica de apoio ou suporte</strong> referente a esse traço?
      </>
    ),
  },
  {
    id: 'q6',
    min: 1,
    texto: (
      <>
        O que <strong>você</strong> pode fazer <strong>somado</strong> ao que os <strong>outros</strong> podem fazer, é
        suficiente? Se não for, liste abaixo o que mais seria necessário e que recursos você necessita.
      </>
    ),
  },
  {
    id: 'q7',
    min: 1,
    texto: <>Como você pode conseguir as coisas citadas na questão acima. Liste e explique.</>,
  },
];

const QUESTOES_OPORTUNIDADE = [
  {
    id: 'q1',
    min: 70,
    texto: (
      <>
        Escreva abaixo <strong>quando e como</strong> foi a <strong>última vez</strong> que você se lembra deste traço
        sendo manifestado. Pense em um momento recente em que você tenha percebido que esse traço apareceu de forma{' '}
        <strong>positiva ou negativa</strong>.
      </>
    ),
  },
  {
    id: 'q2',
    min: 60,
    texto: (
      <>
        Escreva abaixo as <strong>consequências negativas ou positivas</strong> da situação citada e como você se sentiu
        com relação a elas.
      </>
    ),
  },
  {
    id: 'q3',
    min: 45,
    texto: (
      <>
        Se esse traço for trabalhado, que <strong>benefícios</strong> ele poderia trazer para sua vida? Pense no potencial
        positivo escondido por trás da dificuldade.
      </>
    ),
  },
  {
    id: 'q4',
    min: 45,
    texto: (
      <>
        Que tipo de <strong>apoio, estrutura ou suporte</strong> você precisaria para transformar esse traço em algo
        positivo na sua vida?
      </>
    ),
  },
  {
    id: 'q5',
    min: 50,
    texto: (
      <>
        O que você pode <strong>começar a fazer</strong> para transformar esse traço em uma força? Liste atitudes, hábitos,
        pequenas mudanças que dependem de você.
      </>
    ),
  },
  {
    id: 'q6',
    min: 35,
    texto: (
      <>
        Escreva abaixo o que você acha que as <strong>outras pessoas</strong> podem fazer para te dar{' '}
        <strong>apoio e suporte</strong>.
      </>
    ),
  },
  {
    id: 'q7',
    min: 1,
    texto: (
      <>
        O que você pode fazer somado ao que os outros podem fazer, é suficiente? Que recursos você precisa? Se não for,
        liste o que mais seria necessário.
      </>
    ),
  },
  {
    id: 'q8',
    min: 1,
    texto: <>Como você pode conseguir as coisas citadas na questão acima? Liste e explique.</>,
  },
];

const QUESTOES_POR_QUADRANTE = {
  ameaca:       QUESTOES_AMEACA_FRAQUEZA,
  fraqueza:     QUESTOES_AMEACA_FRAQUEZA,
  oportunidade: QUESTOES_OPORTUNIDADE,
  forca:        [],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function contarPalavras(text) {
  return String(text ?? '').trim().split(/\s+/).filter(Boolean).length;
}

function reflexoesSaoValidas(reflexoes, questoes) {
  return questoes.every(({ id, min }) => contarPalavras(reflexoes[id]) >= min);
}

function estadoInicial(questoes) {
  return Object.fromEntries(questoes.map(({ id }) => [id, '']));
}

function tocadoInicial(questoes) {
  return Object.fromEntries(questoes.map(({ id }) => [id, false]));
}

// ─── Sub-componentes ───────────────────────────────────────────────────────

function ListaComVerMais({ itens = [], expandido, onToggle }) {
  if (!itens.length) return null;
  const visiveis = expandido ? itens : itens.slice(0, 2);
  return (
    <>
      <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
        {visiveis.map((texto, i) => (
          <li key={i}>{texto}</li>
        ))}
      </ul>
      {itens.length > 2 && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 text-sm font-semibold text-violet-700 hover:text-violet-900 underline underline-offset-2"
        >
          {expandido ? 'Ver menos' : 'Clique aqui para ver mais'}
        </button>
      )}
    </>
  );
}

function CampoReflexao({ id, value, onChange, onBlur, minPalavras, invalid }) {
  const n     = contarPalavras(value);
  const faltam = Math.max(0, minPalavras - n);
  const border = invalid
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-violet-500';

  return (
    <div className="space-y-1">
      <p className="font-medium text-gray-900">R:</p>
      <textarea
        id={id}
        className={`w-full min-h-[140px] px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-y ${border}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Escreva sua resposta aqui…"
        aria-invalid={invalid}
      />
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
        Mínimo de {minPalavras} {minPalavras === 1 ? 'palavra' : 'palavras'}. Atual: {n}{' '}
        {n === 1 ? 'palavra' : 'palavras'}.
      </p>
      {invalid && (
        <p className="text-[10px] sm:text-xs text-red-600 font-medium" role="alert">
          Faltam {faltam} {faltam === 1 ? 'palavra' : 'palavras'} para atingir o mínimo.
        </p>
      )}
    </div>
  );
}

// ─── Conteúdo do modal ─────────────────────────────────────────────────────

function ConteudoAmeacaFraqueza({ detalhe, secoes }) {
  const [verAtrapalha, setVerAtrapalha] = useState(false);
  const [verDicas,     setVerDicas]     = useState(false);
  const [verExemplos,  setVerExemplos]  = useState(false);

  const atrapalhar = (detalhe.comoAtrapalhar  || []);
  const reduzir    = (detalhe.reduzirImpacto  || []);
  const dicas      = (detalhe.dicas           || []);
  const exemplos   = (detalhe.exemplos        || []);

  return (
    <>
      {atrapalhar.length > 0 && (
        <section id={secoes.atrapalhar} className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Como esse traço pode atrapalhar:</h4>
          <ListaComVerMais itens={atrapalhar} expandido={verAtrapalha} onToggle={() => setVerAtrapalha((v) => !v)} />
        </section>
      )}

      {reduzir.length > 0 && (
        <section className="space-y-3">
          <h4 className="font-semibold text-gray-900">Como reduzir o impacto negativo desse traço</h4>
          {reduzir.map((p, i) => <p key={i} className="text-sm sm:text-base">{p}</p>)}
        </section>
      )}

      {dicas.length > 0 && (
        <section id={secoes.dicas} className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Dicas práticas</h4>
          <ListaComVerMais itens={dicas} expandido={verDicas} onToggle={() => setVerDicas((v) => !v)} />
        </section>
      )}

      {exemplos.length > 0 && (
        <section id={secoes.exemplos} className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Exemplos práticos</h4>
          <ListaComVerMais itens={exemplos} expandido={verExemplos} onToggle={() => setVerExemplos((v) => !v)} />
        </section>
      )}
    </>
  );
}

function ConteudoOportunidade({ detalhe }) {
  const [verExemplos, setVerExemplos] = useState(false);
  const [verDicas,    setVerDicas]    = useState(false);

  const oport   = (detalhe.comoOportunidade || []);
  const exemplos = (detalhe.exemplos        || []);
  const dicas    = (detalhe.dicas           || []);

  return (
    <>
      {oport.length > 0 && (
        <section className="space-y-3">
          <h4 className="font-semibold text-gray-900">
            Como esse traço pode ser uma oportunidade de se transformar em força, caso seja trabalhado
          </h4>
          {oport.map((p, i) => <p key={i} className="text-sm sm:text-base">{p}</p>)}
        </section>
      )}

      {exemplos.length > 0 && (
        <section className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Exemplos de como esse traço pode se tornar uma força</h4>
          <ListaComVerMais itens={exemplos} expandido={verExemplos} onToggle={() => setVerExemplos((v) => !v)} />
        </section>
      )}

      {dicas.length > 0 && (
        <section className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Dicas para reduzir o impacto ou usar como força</h4>
          <ListaComVerMais itens={dicas} expandido={verDicas} onToggle={() => setVerDicas((v) => !v)} />
        </section>
      )}
    </>
  );
}

function ConteudoForca({ detalhe }) {
  const [verUsar, setVerUsar] = useState(false);

  const usar = (detalhe.comoUsar || []);

  return (
    <>
      {usar.length > 0 && (
        <section className="space-y-3 rounded-xl border border-green-100 bg-green-50/40 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Como essa força pode ser usada</h4>
          <ListaComVerMais itens={usar} expandido={verUsar} onToggle={() => setVerUsar((v) => !v)} />
        </section>
      )}
    </>
  );
}

// ─── Modal principal ───────────────────────────────────────────────────────

function SwotTracoModal({ isOpen, onClose, onSalvo, tracoInfo }) {
  const [detalhe,      setDetalhe]      = useState(null);
  const [carregando,   setCarregando]   = useState(false);
  const [erro,         setErro]         = useState(null);
  const [erroSalvar,   setErroSalvar]   = useState(null);
  const [salvoCom,     setSalvoCom]     = useState(false);
  const [reflexoes,    setReflexoes]    = useState({});
  const [tocados,      setTocados]      = useState({});
  const [salvando,     setSalvando]     = useState(false);

  const secoesRef = useRef({ atrapalhar: 'secao-atrapalhar', dicas: 'secao-dicas', exemplos: 'secao-exemplos' });

  const questoes = tracoInfo ? (QUESTOES_POR_QUADRANTE[tracoInfo.quadrante] || []) : [];

  // Carrega detalhe e reflexões ao abrir
  useEffect(() => {
    if (!isOpen || !tracoInfo) return;

    setDetalhe(null);
    setErro(null);
    setErroSalvar(null);
    setSalvoCom(false);
    setCarregando(true);

    const { tipo, numeroTraco, quadrante } = tracoInfo;

    Promise.all([
      api.get(`/traco-detalhe/${tipo}/${numeroTraco}`).catch(() => null),
      api.get(`/reflexao-traco/${tipo}/${numeroTraco}/${quadrante}`).catch(() => null),
    ]).then(([resDetalhe, resReflexao]) => {
      setDetalhe(resDetalhe?.data ?? null);
      const respostas = resReflexao?.data?.respostas ?? {};
      const qs = QUESTOES_POR_QUADRANTE[quadrante] || [];
      setReflexoes(Object.fromEntries(qs.map(({ id }) => [id, respostas[id] ?? ''])));
      setTocados(tocadoInicial(qs));
    }).finally(() => setCarregando(false));
  }, [isOpen, tracoInfo]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!isOpen || !tracoInfo) return null;

  const setCampo = (key, value) => setReflexoes((prev) => ({ ...prev, [key]: value }));
  const marcarTocado = (key) => setTocados((prev) => ({ ...prev, [key]: true }));

  const reflexaoInvalida = (id, min) => {
    const n = contarPalavras(reflexoes[id] ?? '');
    if (n >= min) return false;
    return tocados[id] || (reflexoes[id] ?? '').trim().length > 0;
  };

  const handleSalvar = async () => {
    if (questoes.length && !reflexoesSaoValidas(reflexoes, questoes)) {
      setTocados(Object.fromEntries(questoes.map(({ id }) => [id, true])));
      document.getElementById('secao-questoes-reflexivas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSalvando(true);
    setErroSalvar(null);
    try {
      await api.post('/reflexao-traco', {
        tipo:        tracoInfo.tipo,
        numeroTraco: tracoInfo.numeroTraco,
        quadrante:   tracoInfo.quadrante,
        respostas:   reflexoes,
      });
      setSalvoCom(true);
      setTimeout(() => (onSalvo ?? onClose)(), 800);
    } catch (err) {
      console.error('[SwotTracoModal] Erro ao salvar reflexão:', err?.response?.data ?? err?.message ?? err);
      setErroSalvar('Não foi possível salvar. Verifique sua conexão e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const titulo = detalhe?.titulo ?? tracoInfo.label;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50 shrink-0">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-violet-700">Detalhes do traço</p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{titulo}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
            type="button"
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-gray-700 space-y-5 leading-relaxed">
          {carregando && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            </div>
          )}

          {!carregando && !detalhe && (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg font-medium">Conteúdo não disponível</p>
              <p className="text-sm mt-1">As informações detalhadas deste traço ainda não foram cadastradas.</p>
            </div>
          )}

          {!carregando && detalhe && (
            <>
              {/* O que é */}
              {(detalhe.oQueE || []).length > 0 && (
                <section className="space-y-3">
                  <h4 className="font-semibold text-gray-900">O que é</h4>
                  {detalhe.oQueE.map((p, i) => (
                    <p key={i} className="text-sm sm:text-base">{p}</p>
                  ))}
                </section>
              )}

              {/* Seções específicas por quadrante */}
              {(tracoInfo.quadrante === 'ameaca' || tracoInfo.quadrante === 'fraqueza') && (
                <ConteudoAmeacaFraqueza detalhe={detalhe} secoes={secoesRef.current} />
              )}
              {tracoInfo.quadrante === 'oportunidade' && (
                <ConteudoOportunidade detalhe={detalhe} />
              )}
              {tracoInfo.quadrante === 'forca' && (
                <ConteudoForca detalhe={detalhe} />
              )}

              {/* Questões reflexivas */}
              {questoes.length > 0 && (
                <section id="secao-questoes-reflexivas" className="space-y-6 pt-6 mt-2 border-t-2 border-violet-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Questões reflexivas</h3>
                  <p className="text-sm sm:text-base text-gray-800">
                    Responda as questões abaixo para descobrir como esse traço impacta sua vida e o que pode ser feito.
                  </p>

                  <div className="space-y-6 text-sm sm:text-base">
                    {questoes.map(({ id, min, texto }, idx) => (
                      <div key={id} className="space-y-3">
                        <p>
                          <span className="font-semibold text-gray-900">{idx + 1})</span> {texto}
                        </p>

                        {id === 'q3' && tracoInfo.quadrante !== 'oportunidade' && (
                          <>
                            <p className="text-gray-800">Pergunte a si:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              <li>O que posso começar a fazer diferente para lidar melhor com isso?</li>
                              <li>Existe alguma rotina, estratégia ou ferramenta que posso usar?</li>
                              <li>Posso tentar prever situações em que esse traço aparece e me preparar antes?</li>
                            </ul>
                            <p>
                              Para ver exemplos,{' '}
                              <button type="button" onClick={() => scrollTo('secao-dicas')}
                                className="font-semibold text-violet-700 underline">
                                clique aqui para ver dicas práticas
                              </button>.
                            </p>
                          </>
                        )}

                        {id === 'q5' && tracoInfo.quadrante !== 'oportunidade' && (
                          <>
                            <p className="text-gray-800">Por exemplo:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              <li>Ter alguém que acompanhe meu progresso com frequência</li>
                              <li>Ter prazos intermediários em vez de um só</li>
                              <li>Ter apoio na organização do tempo ou das ideias</li>
                            </ul>
                            <p>
                              Para ver exemplos,{' '}
                              <button type="button" onClick={() => scrollTo('secao-exemplos')}
                                className="font-semibold text-violet-700 underline">
                                clique aqui para ver exemplos práticos
                              </button>.
                            </p>
                          </>
                        )}

                        <CampoReflexao
                          id={`reflexao-${id}`}
                          value={reflexoes[id] ?? ''}
                          onChange={(v) => setCampo(id, v)}
                          onBlur={() => marcarTocado(id)}
                          minPalavras={min}
                          invalid={reflexaoInvalida(id, min)}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 p-5 border-t border-gray-200 bg-gray-50 shrink-0">
          {erroSalvar && (
            <p className="text-sm text-red-600 font-medium text-center">{erroSalvar}</p>
          )}
          {salvoCom && (
            <p className="text-sm text-green-600 font-medium text-center">Respostas salvas com sucesso!</p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 font-semibold transition-colors"
            >
              Fechar
            </button>
            {questoes.length > 0 && (
              <button
                type="button"
                onClick={handleSalvar}
                disabled={salvando || salvoCom}
                className="px-6 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold transition-colors disabled:opacity-60"
              >
                {salvando ? 'Salvando…' : salvoCom ? 'Salvo!' : 'Salvar respostas'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwotTracoModal;
