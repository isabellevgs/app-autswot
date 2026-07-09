import { useState, useEffect } from 'react';
import CampoDiario from './CampoDiario';
import {
  PERGUNTA_AUTOADVOCACIA_1,
  PERGUNTA_AUTOADVOCACIA_2,
  contarPalavras,
} from '../../constants/diarioPrompts';

function DiarioAutoadvocaciaQuinzena({ quinzena, onSave, saving }) {
  const [resposta1, setResposta1] = useState('');
  const [resposta2, setResposta2] = useState('');
  const [tocado, setTocado] = useState({ r1: false, r2: false });
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setResposta1(quinzena?.resposta1 ?? '');
    setResposta2(quinzena?.resposta2 ?? '');
    setTocado({ r1: false, r2: false });
    setErro(null);
  }, [quinzena?.numero, quinzena?.resposta1, quinzena?.resposta2]);

  if (!quinzena) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Selecione uma quinzena</h3>
          <p className="text-gray-600">
            Escolha um período na linha do tempo ou crie uma nova quinzena.
          </p>
        </div>
      </div>
    );
  }

  const min = quinzena.minPalavras ?? 50;
  const invalido1 = tocado.r1 && contarPalavras(resposta1) < min && resposta1.trim().length > 0;
  const invalido2 = tocado.r2 && contarPalavras(resposta2) < min && resposta2.trim().length > 0;

  const mudou =
    resposta1 !== (quinzena.resposta1 ?? '') ||
    resposta2 !== (quinzena.resposta2 ?? '');

  const handleSalvar = async (finalizar) => {
    setErro(null);
    if (finalizar && (contarPalavras(resposta1) < min || contarPalavras(resposta2) < min)) {
      setTocado({ r1: true, r2: true });
      return;
    }
    try {
      await onSave(quinzena.numero, resposta1, resposta2, finalizar);
    } catch (err) {
      setErro(err?.message ?? 'Erro ao salvar.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-200 bg-gradient-to-r from-violet-50 to-white px-8 py-6 rounded-t-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mb-1">
          Diário de Autoadvocacia
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          {quinzena.rotulo ?? `Quinzena ${quinzena.numero}`}
        </h2>
        {quinzena.concluida && (
          <span className="inline-block mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Concluída
          </span>
        )}
      </div>

      <div className="p-8 space-y-10">
        <div>
          <p className="font-semibold text-gray-900 mb-3">1) {PERGUNTA_AUTOADVOCACIA_1}</p>
          <CampoDiario
            id={`adv-${quinzena.numero}-r1`}
            value={resposta1}
            onChange={setResposta1}
            onBlur={() => setTocado((t) => ({ ...t, r1: true }))}
            minPalavras={min}
            invalid={invalido1}
          />
        </div>

        <div>
          <p className="font-semibold text-gray-900 mb-3">2) {PERGUNTA_AUTOADVOCACIA_2}</p>
          <CampoDiario
            id={`adv-${quinzena.numero}-r2`}
            value={resposta2}
            onChange={setResposta2}
            onBlur={() => setTocado((t) => ({ ...t, r2: true }))}
            minPalavras={min}
            invalid={invalido2}
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => handleSalvar(false)}
            disabled={saving || !mudou}
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
            {saving ? 'Salvando…' : 'Concluir quinzena'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiarioAutoadvocaciaQuinzena;
