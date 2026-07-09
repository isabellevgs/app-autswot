import { Check, Plus } from 'lucide-react';

function formatarPeriodo(inicio, fim) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
    });
  return `${fmt(inicio)} – ${fmt(fim)}`;
}

function DiarioAutoadvocaciaTimeline({
  quinzenas,
  quinzenaSelecionada,
  onSelect,
  onCreate,
  creating,
}) {
  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="px-6 py-4 sticky top-0 bg-white border-b border-gray-200 z-10">
        <h2 className="text-xl font-bold text-gray-900">Autoadvocacia</h2>
        <p className="text-sm text-gray-500 mt-1">Reflexões quinzenais</p>
      </div>

      <div className="p-4 space-y-2">
        {quinzenas.map((q) => {
          const selecionada = quinzenaSelecionada?.numero === q.numero;
          const temConteudo = q.resposta1?.trim() || q.resposta2?.trim();
          return (
            <button
              key={q.numero}
              type="button"
              onClick={() => onSelect(q)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selecionada
                  ? 'border-violet-500 bg-violet-50 shadow-sm'
                  : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-900 text-sm">
                  {q.rotulo ?? `Quinzena ${q.numero}`}
                </span>
                {q.concluida ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : temConteudo ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Rascunho" />
                ) : null}
              </div>
              <p className="text-xs text-gray-500 mt-1">{formatarPeriodo(q.inicio, q.fim)}</p>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onCreate}
          disabled={creating}
          className="w-full mt-4 px-4 py-3 rounded-xl border-2 border-dashed border-violet-300 text-violet-700 font-semibold hover:bg-violet-50 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {creating ? 'Criando…' : 'Nova quinzena'}
        </button>
      </div>
    </div>
  );
}

export default DiarioAutoadvocaciaTimeline;
