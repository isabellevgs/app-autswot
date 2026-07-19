import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { extrairErroApi } from '../../utils/api-errors';
import { montarItensAtrapalhar, montarExemplosOportunidade, montarExemplosPraticosForca, montarComoUsar } from '../../constants/relatorioSh';
import { ROTULOS_VER_MAIS } from '../../constants/relatorioAmeacaFraqueza.jsx';
import { ROTULOS_VER_MAIS_FO, TITULOS_FO } from '../../constants/relatorioFo.jsx';
import { TITULOS_FORCA } from '../../constants/relatorioForca.jsx';
import {
  TITULO_EXERCICIOS,
  introExercicios,
  questoesDoQuadrante,
} from '../../constants/swotQuadranteExercicios.jsx';

async function carregarRelatorio(tipo, numeroTraco) {
  const url =
    tipo === 'SH'
      ? `/relatorio-sh/${numeroTraco}`
      : tipo === 'CH'
        ? `/relatorio-ch/${numeroTraco}`
        : `/traco-detalhe/${tipo}/${numeroTraco}`;

  try {
    const res = await api.get(url);
    return { detalhe: res.data, erroRelatorio: null, mensagemErro: null };
  } catch (err) {
    if (err?.response?.status === 404) {
      return { detalhe: null, erroRelatorio: 'nao_cadastrado', mensagemErro: null };
    }
    return {
      detalhe: null,
      erroRelatorio: 'rede',
      mensagemErro: extrairErroApi(err, 'Erro ao carregar o relatório deste traço.'),
    };
  }
}

async function carregarReflexao(tipo, numeroTraco, quadrante) {
  try {
    const res = await api.get(`/reflexao-traco/${tipo}/${numeroTraco}/${quadrante}`);
    return res.data?.respostas ?? {};
  } catch {
    return {};
  }
}

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

function embaralharComSeed(itens, seed) {
  const arr = [...itens];
  let s = Math.abs(seed) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function hashTraco(tipo, numeroTraco) {
  const str = `${tipo}-${numeroTraco}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h;
}

function ListaComVerMais({
  itens = [],
  expandido,
  onToggle,
  aleatorio = false,
  seed = 0,
  rotulos = { expandir: 'Clique aqui para ver mais', recolher: 'Ver menos' },
}) {
  const visiveis = useMemo(() => {
    if (expandido || itens.length <= 2) return itens;
    if (aleatorio) return embaralharComSeed(itens, seed).slice(0, 2);
    return itens.slice(0, 2);
  }, [itens, expandido, aleatorio, seed]);

  if (!itens.length) return null;

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
          {expandido ? rotulos.recolher : rotulos.expandir}
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

function ConteudoAmeacaFraqueza({ detalhe, secoes, tracoSeed, exemplosVisivel }) {
  const [verAtrapalha, setVerAtrapalha] = useState(false);
  const [verDicas,     setVerDicas]     = useState(false);
  const [verExemplos,  setVerExemplos]  = useState(false);

  useEffect(() => {
    if (exemplosVisivel) setVerExemplos(true);
  }, [exemplosVisivel]);

  const atrapalhar = montarItensAtrapalhar(detalhe);
  const reduzir    = (detalhe.reduzirImpacto  || []);
  const dicas      = (detalhe.dicas           || []);
  const exemplos   = (detalhe.exemplos        || []);

  return (
    <>
      {atrapalhar.length > 0 && (
        <section id={secoes.atrapalhar} className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Como esse traço pode atrapalhar</h4>
          <ListaComVerMais
            itens={atrapalhar}
            expandido={verAtrapalha}
            onToggle={() => setVerAtrapalha((v) => !v)}
            aleatorio
            seed={tracoSeed}
            rotulos={ROTULOS_VER_MAIS.atrapalhar}
          />
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
          <ListaComVerMais
            itens={dicas}
            expandido={verDicas}
            onToggle={() => setVerDicas((v) => !v)}
            rotulos={ROTULOS_VER_MAIS.dicas}
          />
        </section>
      )}

      {exemplos.length > 0 && (
        <section id={secoes.exemplos} className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <h4 className="font-semibold text-gray-900">Exemplos práticos</h4>
          <ListaComVerMais
            itens={exemplos}
            expandido={verExemplos}
            onToggle={() => setVerExemplos((v) => !v)}
            rotulos={ROTULOS_VER_MAIS.exemplos}
          />
        </section>
      )}
    </>
  );
}

function TituloSecao({ children }) {
  return <h4 className="font-semibold text-gray-900">{children}</h4>;
}

function ConteudoFo({ detalhe, quadrante, secoes, tipoTraco }) {
  const [verDicas, setVerDicas] = useState(false);

  const mostrarOportunidade = quadrante === 'oportunidade';
  const mostrarFraqueza = quadrante === 'fraqueza';
  const isForca = tipoTraco === 'F';
  const mostrarExemplosForca = isForca && (mostrarOportunidade || mostrarFraqueza);

  const oport              = detalhe.comoOportunidade || [];
  const exemplosOportunidade = isForca
    ? montarExemplosPraticosForca(detalhe)
    : montarExemplosOportunidade(detalhe);
  const tituloExemplosOportunidade = isForca
    ? TITULOS_FORCA.exemplosPraticos
    : TITULOS_FO.exemplosOportunidade;
  const tituloComoOportunidade = isForca
    ? TITULOS_FORCA.comoOportunidade
    : TITULOS_FO.comoOportunidade;
  const tituloFraquezaOuAmeaca = isForca
    ? TITULOS_FORCA.fraquezaOuOportunidade
    : TITULOS_FO.fraquezaOuAmeaca;
  const fraquezaOuAmeaca   = detalhe.fraquezaOuAmeaca || [];
  const atrapalhar         = montarItensAtrapalhar(detalhe);
  const transformarEmForca = detalhe.transformarEmForca || [];
  const transformarEmOportunidade = detalhe.transformarEmOportunidade || [];
  const dicas              = !isForca ? (detalhe.dicas || []) : [];
  const exemplosPraticos   = detalhe.exemplos || [];

  return (
    <>
      {mostrarOportunidade && oport.length > 0 && (
        <section className="space-y-3">
          <TituloSecao>{tituloComoOportunidade}</TituloSecao>
          {oport.map((p, i) => <p key={i} className="text-sm sm:text-base">{p}</p>)}
        </section>
      )}

      {mostrarOportunidade && exemplosOportunidade.length > 0 && (
        <section className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <TituloSecao>{tituloExemplosOportunidade}</TituloSecao>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
            {exemplosOportunidade.map((texto, i) => (
              <li key={i}>{texto}</li>
            ))}
          </ul>
        </section>
      )}

      {mostrarOportunidade && isForca && transformarEmForca.length > 0 && (
        <section className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <TituloSecao>{TITULOS_FORCA.transformarEmForca}</TituloSecao>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
            {transformarEmForca.map((texto, i) => (
              <li key={i}>{texto}</li>
            ))}
          </ul>
        </section>
      )}

      {mostrarFraqueza && fraquezaOuAmeaca.length > 0 && (
        <section className="space-y-3">
          <TituloSecao>{tituloFraquezaOuAmeaca}</TituloSecao>
          {fraquezaOuAmeaca.map((p, i) => (
            <p key={i} className="text-sm sm:text-base">{p}</p>
          ))}
        </section>
      )}

      {mostrarFraqueza && isForca && transformarEmOportunidade.length > 0 && (
        <section className="space-y-3 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          <TituloSecao>{TITULOS_FORCA.transformarEmOportunidade}</TituloSecao>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
            {transformarEmOportunidade.map((texto, i) => (
              <li key={i}>{texto}</li>
            ))}
          </ul>
        </section>
      )}

      {mostrarFraqueza && !isForca && atrapalhar.length > 0 && (
        <section className="space-y-3 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          <TituloSecao>{TITULOS_FO.comoAtrapalhar}</TituloSecao>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
            {atrapalhar.map((texto, i) => (
              <li key={i}>{texto}</li>
            ))}
          </ul>
        </section>
      )}

      {dicas.length > 0 && (
        <section id={secoes.dicas} className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <TituloSecao>{TITULOS_FO.dicas}</TituloSecao>
          <ListaComVerMais
            itens={dicas}
            expandido={verDicas}
            onToggle={() => setVerDicas((v) => !v)}
            rotulos={ROTULOS_VER_MAIS_FO.dicas}
          />
        </section>
      )}

      {((isForca && mostrarExemplosForca) || !isForca) && exemplosPraticos.length > 0 && (
        <section id={secoes.exemplos} className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 scroll-mt-4">
          <TituloSecao>{isForca ? TITULOS_FORCA.exemplosPraticos : TITULOS_FO.exemplos}</TituloSecao>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
            {exemplosPraticos.map((texto, i) => (
              <li key={i}>{texto}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function ConteudoForca({ detalhe }) {
  const usar = montarComoUsar(detalhe);

  return (
    <>
      {usar.length > 0 && (
        <section className="space-y-3 rounded-xl border border-green-100 bg-green-50/40 p-4 scroll-mt-4">
          <TituloSecao>{TITULOS_FORCA.comoUsar}</TituloSecao>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
            {usar.map((texto, i) => (
              <li key={i}>{texto}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

// ─── Modal principal ───────────────────────────────────────────────────────

function SwotTracoModal({ isOpen, onClose, onSalvo, tracoInfo }) {
  const [detalhe,      setDetalhe]      = useState(null);
  const [carregando,   setCarregando]   = useState(false);
  const [erroRelatorio, setErroRelatorio] = useState(null);
  const [mensagemErroRelatorio, setMensagemErroRelatorio] = useState(null);
  const [erroSalvar,   setErroSalvar]   = useState(null);
  const [salvoCom,     setSalvoCom]     = useState(false);
  const [reflexoes,    setReflexoes]    = useState({});
  const [tocados,      setTocados]      = useState({});
  const [salvandoComo, setSalvandoComo] = useState(null); // 'rascunho' | 'envio' | null
  const [exemplosVisivel, setExemplosVisivel] = useState(false);
  const [diarioPaginaChave, setDiarioPaginaChave] = useState(null);

  const secoesRef = useRef({
    atrapalhar: 'secao-atrapalhar',
    dicas: 'secao-dicas',
    exemplos: 'secao-exemplos',
    dicasOportunidade: 'secao-dicas-oportunidade',
    exemplosOportunidade: 'secao-exemplos-oportunidade',
    dicasFo: 'secao-dicas-fo',
    exemplosFo: 'secao-exemplos-praticos-fo',
  });
  const tracoSeed = tracoInfo ? hashTraco(tracoInfo.tipo, tracoInfo.numeroTraco) : 0;
  const quadrante = tracoInfo?.quadrante;
  const isFo = tracoInfo?.tipo === 'FO';
  const isF = tracoInfo?.tipo === 'F';
  const isShCh = tracoInfo?.tipo === 'SH' || tracoInfo?.tipo === 'CH';
  const isAmeacaFraquezaShCh = isShCh && (quadrante === 'ameaca' || quadrante === 'fraqueza');
  const isOportunidade = quadrante === 'oportunidade';

  const questoes = tracoInfo ? questoesDoQuadrante(quadrante) : [];
  const introExercicio = tracoInfo ? introExercicios(quadrante) : null;

  // Carrega detalhe e reflexões ao abrir
  useEffect(() => {
    if (!isOpen || !tracoInfo) return;

    setDetalhe(null);
    setErroRelatorio(null);
    setMensagemErroRelatorio(null);
    setErroSalvar(null);
    setSalvoCom(false);
    setSalvandoComo(null);
    setExemplosVisivel(false);
    setDiarioPaginaChave(null);
    setCarregando(true);

    const { tipo, numeroTraco, quadrante } = tracoInfo;

    Promise.all([
      carregarRelatorio(tipo, numeroTraco),
      carregarReflexao(tipo, numeroTraco, quadrante),
    ]).then(([relatorio, respostas]) => {
      setDetalhe(relatorio.detalhe);
      setErroRelatorio(relatorio.erroRelatorio);
      setMensagemErroRelatorio(relatorio.mensagemErro);
      const qs = questoesDoQuadrante(quadrante);
      setReflexoes(Object.fromEntries(qs.map(({ id }) => [id, respostas[id] ?? ''])));
      setTocados(tocadoInicial(qs));
    }).finally(() => setCarregando(false));
  }, [isOpen, tracoInfo]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const mostrarExemplos = useCallback(() => {
    setExemplosVisivel(true);
    setTimeout(() => scrollTo('secao-exemplos'), 50);
  }, [scrollTo]);

  if (!isOpen || !tracoInfo) return null;

  const setCampo = (key, value) => setReflexoes((prev) => ({ ...prev, [key]: value }));
  const marcarTocado = (key) => setTocados((prev) => ({ ...prev, [key]: true }));

  const reflexaoInvalida = (id, min) => {
    const n = contarPalavras(reflexoes[id] ?? '');
    if (n >= min) return false;
    return tocados[id] || (reflexoes[id] ?? '').trim().length > 0;
  };

  const payloadReflexao = () => ({
    tipo:        tracoInfo.tipo,
    numeroTraco: tracoInfo.numeroTraco,
    quadrante:   tracoInfo.quadrante,
    respostas:   reflexoes,
  });

  const handleSalvarRascunho = async () => {
    setSalvandoComo('rascunho');
    setErroSalvar(null);
    try {
      await api.post('/reflexao-traco', { ...payloadReflexao(), enviado: false });
      (onSalvo ?? onClose)();
    } catch (err) {
      console.error('[SwotTracoModal] Erro ao salvar rascunho:', err?.response?.data ?? err?.message ?? err);
      setErroSalvar(extrairErroApi(err, 'Não foi possível salvar. Verifique sua conexão e tente novamente.'));
    } finally {
      setSalvandoComo(null);
    }
  };

  const handleSalvar = async () => {
    if (questoes.length && !reflexoesSaoValidas(reflexoes, questoes)) {
      setTocados(Object.fromEntries(questoes.map(({ id }) => [id, true])));
      document.getElementById('secao-questoes-reflexivas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSalvandoComo('envio');
    setErroSalvar(null);
    try {
      const res = await api.post('/reflexao-traco', { ...payloadReflexao(), enviado: true });
      setSalvoCom(true);
      if (res.data?.diarioPaginaChave) {
        setDiarioPaginaChave(res.data.diarioPaginaChave);
      } else {
        setTimeout(() => (onSalvo ?? onClose)(), 800);
      }
    } catch (err) {
      console.error('[SwotTracoModal] Erro ao salvar reflexão:', err?.response?.data ?? err?.message ?? err);
      setErroSalvar(extrairErroApi(err, 'Não foi possível salvar. Verifique sua conexão e tente novamente.'));
    } finally {
      setSalvandoComo(null);
    }
  };

  const titulo = tracoInfo.label || detalhe?.titulo;

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

          {!carregando && erroRelatorio === 'rede' && (
            <div className="py-8 text-center">
              <p className="text-lg font-medium text-red-700">{mensagemErroRelatorio}</p>
              <button
                type="button"
                onClick={() => {
                  if (!tracoInfo) return;
                  setCarregando(true);
                  carregarRelatorio(tracoInfo.tipo, tracoInfo.numeroTraco).then((relatorio) => {
                    setDetalhe(relatorio.detalhe);
                    setErroRelatorio(relatorio.erroRelatorio);
                    setMensagemErroRelatorio(relatorio.mensagemErro);
                  }).finally(() => setCarregando(false));
                }}
                className="mt-3 text-sm font-semibold text-violet-700 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && erroRelatorio === 'nao_cadastrado' && (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg font-medium">Conteúdo não disponível</p>
              <p className="text-sm mt-1">As informações detalhadas deste traço ainda não foram cadastradas.</p>
            </div>
          )}

          {!carregando && !erroRelatorio && !detalhe && (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg font-medium">Conteúdo não disponível</p>
              <p className="text-sm mt-1">As informações detalhadas deste traço ainda não foram cadastradas.</p>
            </div>
          )}

          {!carregando && detalhe && (
            <>
              {/* Momento 1 — Detalhes do traço (conteúdo dinâmico do relatório) */}
              <section aria-label="Detalhes do traço" className="space-y-5">
                {(detalhe.oQueE || []).length > 0 && (
                  <div className="space-y-3">
                    {(isFo || isF) ? (
                      <TituloSecao>{TITULOS_FO.oQueE}</TituloSecao>
                    ) : (
                      <h4 className="font-semibold text-gray-900">O que é</h4>
                    )}
                    {detalhe.oQueE.map((p, i) => (
                      <p key={i} className="text-sm sm:text-base">{p}</p>
                    ))}
                  </div>
                )}

                {isF && (
                  <ConteudoForca detalhe={detalhe} />
                )}

                {(isFo || (isF && quadrante !== 'forca')) && (
                  <ConteudoFo
                    detalhe={detalhe}
                    quadrante={quadrante}
                    tipoTraco={tracoInfo.tipo}
                    secoes={{
                      dicas: secoesRef.current.dicasFo,
                      exemplos: secoesRef.current.exemplosFo,
                    }}
                  />
                )}

                {isAmeacaFraquezaShCh && (
                  <ConteudoAmeacaFraqueza
                    detalhe={detalhe}
                    secoes={secoesRef.current}
                    tracoSeed={tracoSeed}
                    exemplosVisivel={exemplosVisivel}
                  />
                )}
              </section>

              {/* Momento 2 — Exercícios (fixo; sem perguntas em Forças) */}
              {questoes.length > 0 && introExercicio && (
                <section
                  id="secao-exercicios"
                  aria-label="Exercícios de autoconhecimento"
                  className="space-y-6 pt-8 mt-4 border-t-2 border-violet-200"
                >
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{TITULO_EXERCICIOS}</h3>
                    <p className="text-sm sm:text-base text-gray-800">{introExercicio}</p>
                  </div>

                  <div id="secao-questoes-reflexivas" className="space-y-6 text-sm sm:text-base">
                    {questoes.map(({ id, min, texto }, idx) => (
                      <div key={id} className="space-y-3">
                        <p>
                          <span className="font-semibold text-gray-900">{idx + 1})</span> {texto}
                        </p>

                        {id === 'q3' && isAmeacaFraquezaShCh && (
                          <>
                            <p className="text-gray-800">Pergunte a si:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              <li>O que posso começar a fazer diferente para lidar melhor com isso?</li>
                              <li>Existe alguma rotina, estratégia ou ferramenta que posso usar?</li>
                              <li>Posso tentar prever situações em que esse traço aparece e me preparar antes?</li>
                            </ul>
                            <p className="text-gray-800">
                              Essas ações são chamadas de estratégias de enfrentamento. Podem incluir: fazer listas,
                              dividir tarefas, ensaiar conversas, praticar pausas, avisar sobre dificuldades, mudar o
                              ambiente, criar lembretes, pedir ajuda antes da crise, etc.
                            </p>
                            <p>
                              Para ver alguns exemplos, na seção &quot;Dicas práticas&quot; clique no botão{' '}
                              <button
                                type="button"
                                onClick={() => scrollTo('secao-dicas')}
                                className="font-semibold text-violet-700 underline"
                              >
                                Clique aqui para visualizar mais dicas práticas
                              </button>{' '}
                              e veja se alguma delas pode servir para você, mesmo que seja necessário modificá-la de
                              alguma forma.
                            </p>
                          </>
                        )}

                        {id === 'q4' && isAmeacaFraquezaShCh && (
                          <p>
                            Verifique no botão{' '}
                            <button
                              type="button"
                              onClick={() => scrollTo('secao-atrapalhar')}
                              className="font-semibold text-violet-700 underline"
                            >
                              Veja aqui mais exemplos
                            </button>{' '}
                            da seção &quot;Como esse traço pode atrapalhar&quot; exemplos de como o traço pode atrapalhar
                            em diversas situações. Selecione os exemplos nos quais você se identifique para responder
                            essa questão.
                          </p>
                        )}

                        {id === 'q5' && isFo && isOportunidade && (
                          <p>
                            Para ver mais exemplos, clique nos botões{' '}
                            <button
                              type="button"
                              onClick={() => scrollTo('secao-dicas-fo')}
                              className="font-semibold text-violet-700 underline"
                            >
                              Dicas para reduzir o impacto negativo desse traço ou usá-lo como uma força
                            </button>{' '}
                            e{' '}
                            <button
                              type="button"
                              onClick={() => scrollTo('secao-exemplos-praticos-fo')}
                              className="font-semibold text-violet-700 underline"
                            >
                              Exemplos práticos
                            </button>
                            .
                          </p>
                        )}

                        {id === 'q5' && isF && isOportunidade && (
                          <p>
                            Para ver mais exemplos, clique no botão{' '}
                            <button
                              type="button"
                              onClick={() => scrollTo('secao-exemplos-praticos-fo')}
                              className="font-semibold text-violet-700 underline"
                            >
                              Exemplos práticos
                            </button>
                            .
                          </p>
                        )}

                        {id === 'q5' && isAmeacaFraquezaShCh && (
                          <>
                            <p className="text-gray-800">
                              A necessidade específica de apoio e suporte é o que você realmente precisa que esteja
                              disponível ou acessível para funcionar bem.
                            </p>
                            <p className="text-gray-800">Por exemplo:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              <li>Ter alguém que acompanhe meu progresso com frequência</li>
                              <li>Ter prazos intermediários em vez de um só</li>
                              <li>Ter apoio na organização do tempo ou das ideias</li>
                              <li>Ter um ambiente com menos estímulos sensoriais</li>
                              <li>
                                Fazer negociações com familiares, amigos ou parceiros românticos, para ajustar rotinas
                                ou nível/forma de interações
                              </li>
                            </ul>
                            <p className="text-gray-800">
                              Observação: Essa necessidade vai além da ação: ela revela o tipo de suporte estrutural ou
                              relacional que você precisa para evitar os impactos negativos desse traço. Para ver
                              alguns exemplos, clique no botão{' '}
                              <button
                                type="button"
                                onClick={mostrarExemplos}
                                className="font-semibold text-violet-700 underline"
                              >
                                Clique aqui para visualizar exemplos práticos
                              </button>
                              .
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
          {diarioPaginaChave && (
            <div className="mb-2 p-4 rounded-xl bg-violet-50 border border-violet-200 text-center space-y-3">
              <p className="text-sm text-violet-900">
                Exercício enviado! Deseja registrar uma reflexão no diário? (opcional)
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to={`/diario?aba=jornada&pagina=${encodeURIComponent(diarioPaginaChave)}`}
                  className="px-5 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700"
                  onClick={() => (onSalvo ?? onClose)()}
                >
                  Ir para o diário
                </Link>
                <button
                  type="button"
                  onClick={() => (onSalvo ?? onClose)()}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                >
                  Agora não
                </button>
              </div>
            </div>
          )}
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
            {questoes.length > 0 && !diarioPaginaChave && (
              <>
                <button
                  type="button"
                  onClick={handleSalvarRascunho}
                  disabled={!!salvandoComo || salvoCom}
                  className="px-6 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 font-semibold transition-colors disabled:opacity-60"
                >
                  {salvandoComo === 'rascunho' ? 'Salvando…' : 'Salvar sem enviar'}
                </button>
                <button
                  type="button"
                  onClick={handleSalvar}
                  disabled={!!salvandoComo || salvoCom}
                  className="px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold transition-colors disabled:opacity-60"
                >
                  {salvandoComo === 'envio' ? 'Enviando…' : salvoCom ? 'Enviado!' : 'Enviar as respostas'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwotTracoModal;
