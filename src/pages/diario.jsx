import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { extrairErroApi } from '../utils/api-errors';
import DiarioJornadaSidebar from '../components/diary/DiarioJornadaSidebar';
import DiarioJornadaPagina from '../components/diary/DiarioJornadaPagina';
import DiarioAutoadvocaciaTimeline from '../components/diary/DiarioAutoadvocaciaTimeline';
import DiarioAutoadvocaciaQuinzena from '../components/diary/DiarioAutoadvocaciaQuinzena';

const ABAS = [
  { id: 'jornada', label: 'Jornada SWOT' },
  { id: 'autoadvocacia', label: 'Autoadvocacia' },
];

function Diario() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const aba = searchParams.get('aba') === 'autoadvocacia' ? 'autoadvocacia' : 'jornada';
  const paginaChave = searchParams.get('pagina');

  const [paginas, setPaginas] = useState([]);
  const [quinzenas, setQuinzenas] = useState([]);
  const [paginaSelecionada, setPaginaSelecionada] = useState(null);
  const [quinzenaSelecionada, setQuinzenaSelecionada] = useState(null);
  const [loadingJornada, setLoadingJornada] = useState(false);
  const [loadingAutoadvocacia, setLoadingAutoadvocacia] = useState(false);
  const [savingJornada, setSavingJornada] = useState(false);
  const [savingAutoadvocacia, setSavingAutoadvocacia] = useState(false);
  const [creatingQuinzena, setCreatingQuinzena] = useState(false);
  const [erro, setErro] = useState(null);
  const [avisoPaginaBloqueada, setAvisoPaginaBloqueada] = useState(null);

  const loadJornada = useCallback(async () => {
    if (!user?.id) return [];
    try {
      setLoadingJornada(true);
      setErro(null);
      const res = await api.get('/diario/jornada/paginas');
      const lista = res.data.paginas ?? [];
      setPaginas(lista);
      return lista;
    } catch (err) {
      setErro(extrairErroApi(err, 'Erro ao carregar o diário da jornada.'));
      setPaginas([]);
      return [];
    } finally {
      setLoadingJornada(false);
    }
  }, [user?.id]);

  const loadAutoadvocacia = useCallback(async () => {
    if (!user?.id) return [];
    try {
      setLoadingAutoadvocacia(true);
      const res = await api.get('/diario/autoadvocacia/quinzenas');
      const lista = res.data.quinzenas ?? [];
      setQuinzenas(lista);
      return lista;
    } catch (err) {
      setErro(extrairErroApi(err, 'Erro ao carregar o diário de autoadvocacia.'));
      setQuinzenas([]);
      return [];
    } finally {
      setLoadingAutoadvocacia(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadJornada();
      loadAutoadvocacia();
    }
  }, [user?.id, loadJornada, loadAutoadvocacia]);

  useEffect(() => {
    setPaginaSelecionada(null);
    setQuinzenaSelecionada(null);
    setAvisoPaginaBloqueada(null);
  }, [user?.id]);

  useEffect(() => {
    if (!paginas.length) return;

    if (paginaChave) {
      const alvo = paginas.find((p) => p.chave === paginaChave);
      if (alvo?.editavel) {
        setPaginaSelecionada(alvo);
        setAvisoPaginaBloqueada(null);
      } else if (alvo) {
        setPaginaSelecionada(null);
        setAvisoPaginaBloqueada(
          'Esta página ainda não está disponível. Complete o exercício correspondente na SWOT para desbloqueá-la.',
        );
      } else {
        setPaginaSelecionada(null);
        setAvisoPaginaBloqueada('Página não encontrada no seu diário.');
      }
      return;
    }

    const primeiraEditavel = paginas.find((p) => p.editavel);
    if (primeiraEditavel) {
      setPaginaSelecionada(primeiraEditavel);
      setAvisoPaginaBloqueada(null);
    }
  }, [paginas, paginaChave]);

  useEffect(() => {
    if (!quinzenas.length) return;
    const aindaValida = quinzenaSelecionada
      && quinzenas.some((q) => q.numero === quinzenaSelecionada.numero);
    if (!aindaValida) {
      setQuinzenaSelecionada(quinzenas[0]);
    }
  }, [quinzenas, quinzenaSelecionada]);

  useEffect(() => {
    if (!paginaSelecionada?.chave || !paginas.length) return;
    const atualizada = paginas.find((p) => p.chave === paginaSelecionada.chave);
    if (
      atualizada
      && (
        atualizada.updatedAt !== paginaSelecionada.updatedAt
        || atualizada.texto !== paginaSelecionada.texto
        || atualizada.concluida !== paginaSelecionada.concluida
        || atualizada.editavel !== paginaSelecionada.editavel
      )
    ) {
      setPaginaSelecionada(atualizada);
    }
  }, [paginas, paginaSelecionada]);

  const trocarAba = (novaAba) => {
    const params = new URLSearchParams(searchParams);
    params.set('aba', novaAba);
    if (novaAba !== 'jornada') params.delete('pagina');
    setSearchParams(params);
  };

  const selecionarPagina = (pagina) => {
    setPaginaSelecionada(pagina);
    setAvisoPaginaBloqueada(null);
    const params = new URLSearchParams(searchParams);
    params.set('aba', 'jornada');
    params.set('pagina', pagina.chave);
    setSearchParams(params);
  };

  const salvarPagina = async (chave, texto, finalizar) => {
    setSavingJornada(true);
    try {
      const res = await api.put(`/diario/jornada/paginas/${encodeURIComponent(chave)}`, {
        texto,
        finalizar,
      });
      const atualizada = res.data.pagina;
      setPaginas((prev) => prev.map((p) => (p.chave === chave ? atualizada : p)));
      setPaginaSelecionada(atualizada);
    } catch (err) {
      throw new Error(extrairErroApi(err, 'Erro ao salvar reflexão.'));
    } finally {
      setSavingJornada(false);
    }
  };

  const salvarQuinzena = async (numero, resposta1, resposta2, finalizar) => {
    setSavingAutoadvocacia(true);
    try {
      const res = await api.put(`/diario/autoadvocacia/quinzenas/${numero}`, {
        resposta1,
        resposta2,
        finalizar,
      });
      const atualizada = res.data.quinzena;
      setQuinzenas((prev) => prev.map((q) => (q.numero === numero ? atualizada : q)));
      setQuinzenaSelecionada(atualizada);
    } catch (err) {
      throw new Error(extrairErroApi(err, 'Erro ao salvar quinzena.'));
    } finally {
      setSavingAutoadvocacia(false);
    }
  };

  const criarQuinzena = async () => {
    setCreatingQuinzena(true);
    try {
      const res = await api.post('/diario/autoadvocacia/quinzenas');
      const nova = res.data.quinzena;
      setQuinzenas((prev) => [...prev, nova]);
      setQuinzenaSelecionada(nova);
      trocarAba('autoadvocacia');
    } catch (err) {
      setErro(extrairErroApi(err, 'Erro ao criar quinzena.'));
    } finally {
      setCreatingQuinzena(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 lg:px-10 pt-4 border-b border-gray-200 bg-white">
        <div className="flex gap-2">
          {ABAS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => trocarAba(id)}
              className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors ${
                aba === id
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {erro && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-center gap-4">
          <span>{erro}</span>
          <button
            type="button"
            onClick={() => { loadJornada(); loadAutoadvocacia(); }}
            className="font-semibold underline shrink-0"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {avisoPaginaBloqueada && aba === 'jornada' && (
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
          {avisoPaginaBloqueada}
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          {aba === 'jornada' ? (
            <DiarioJornadaSidebar
              paginas={paginas}
              paginaSelecionada={paginaSelecionada}
              onSelect={selecionarPagina}
              loading={loadingJornada}
            />
          ) : (
            <DiarioAutoadvocaciaTimeline
              quinzenas={quinzenas}
              quinzenaSelecionada={quinzenaSelecionada}
              onSelect={setQuinzenaSelecionada}
              onCreate={criarQuinzena}
              creating={creatingQuinzena}
            />
          )}
        </div>

        <div className="flex-1 py-8 px-6 lg:px-10">
          {aba === 'jornada' ? (
            <DiarioJornadaPagina
              pagina={paginaSelecionada}
              onSave={salvarPagina}
              saving={savingJornada}
            />
          ) : (
            <DiarioAutoadvocaciaQuinzena
              quinzena={quinzenaSelecionada}
              onSave={salvarQuinzena}
              saving={savingAutoadvocacia || loadingAutoadvocacia}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Diario;
