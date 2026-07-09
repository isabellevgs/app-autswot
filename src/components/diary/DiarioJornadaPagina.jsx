import { useState, useEffect } from 'react';
import CampoDiario from './CampoDiario';
import { contarPalavras } from '../../constants/diarioPrompts';

function DiarioJornadaPagina({ pagina, onSave, saving }) {
  const [texto, setTexto] = useState(pagina?.texto ?? '');
  const [tocado, setTocado] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setTexto(pagina?.texto ?? '');
    setTocado(false);
    setErro(null);
  }, [pagina?.chave, pagina?.texto]);

  if (!pagina) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Selecione uma página</h3>
          <p className="text-gray-600">
            Escolha um traço ou reflexão na barra lateral para escrever no diário.
          </p>
        </div>
      </div>
    );
  }

  if (!pagina.editavel) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center min-h-[400px] flex items-center justify-center">
        <p className="text-gray-600 max-w-md">
          Esta página será desbloqueada conforme você avança na jornada SWOT.
        </p>
      </div>
    );
  }

  const min = pagina.minPalavras ?? 70;
  const invalido = tocado && contarPalavras(texto) < min && texto.trim().length > 0;

  const handleSalvar = async (finalizar) => {
    setErro(null);
    if (finalizar && contarPalavras(texto) < min) {
      setTocado(true);
      return;
    }
    try {
      await onSave(pagina.chave, texto, finalizar);
      setTocado(false);
    } catch (err) {
      setErro(err?.message ?? 'Erro ao salvar.');
    }
  };

  const textoMudou = texto !== (pagina.texto ?? '');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-200 bg-gradient-to-r from-violet-50 to-white px-8 py-6 rounded-t-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mb-1">
          Diário — Jornada SWOT
        </p>
        <h2 className="text-2xl font-bold text-gray-900">{pagina.titulo}</h2>
        {pagina.concluida && (
          <span className="inline-block mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Concluída
          </span>
        )}
        {pagina.arquivada && (
          <span className="inline-block mt-2 ml-2 text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
            Arquivada
          </span>
        )}
      </div>

      <div className="p-8 space-y-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">{pagina.prompt}</p>
        </div>

        <CampoDiario
          id={`diario-${pagina.chave}`}
          value={texto}
          onChange={setTexto}
          onBlur={() => setTocado(true)}
          minPalavras={min}
          invalid={invalido}
        />

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => handleSalvar(false)}
            disabled={saving || !textoMudou}
            className="px-5 py-2.5 rounded-xl border-2 border-violet-500 text-violet-700 font-semibold hover:bg-violet-50 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar rascunho'}
          </button>
          <button
            type="button"
            onClick={() => handleSalvar(true)}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Concluir reflexão'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiarioJornadaPagina;
