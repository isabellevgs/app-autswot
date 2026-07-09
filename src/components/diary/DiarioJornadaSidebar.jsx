import { Check, Lock, NotebookPen, Archive } from 'lucide-react';
import { TITULOS_QUADRANTE } from '../../constants/diarioPrompts';

const COR_QUADRANTE = {
  ameaca: 'text-red-700 bg-red-50 border-red-200',
  fraqueza: 'text-orange-700 bg-orange-50 border-orange-200',
  oportunidade: 'text-blue-700 bg-blue-50 border-blue-200',
  forca: 'text-green-700 bg-green-50 border-green-200',
  geral: 'text-violet-700 bg-violet-50 border-violet-200',
};

function paginaVisivel(p) {
  return p.editavel || p.concluida || p.texto?.trim();
}

function agruparPaginas(paginas) {
  const grupos = [];
  let grupoAtual = null;

  for (const pagina of paginas) {
    if (pagina.tipo === 'jornada_final') {
      if (grupoAtual) grupos.push(grupoAtual);
      grupos.push({ chave: 'geral', titulo: 'Jornada completa', paginas: [pagina] });
      grupoAtual = null;
      continue;
    }

    const chaveGrupo = pagina.quadrante ?? 'geral';
    const tituloGrupo = pagina.tipo === 'forcas'
      ? TITULOS_QUADRANTE.forca
      : TITULOS_QUADRANTE[pagina.quadrante] ?? 'Diário';

    if (!grupoAtual || grupoAtual.chave !== chaveGrupo) {
      if (grupoAtual) grupos.push(grupoAtual);
      grupoAtual = { chave: chaveGrupo, titulo: tituloGrupo, paginas: [] };
    }
    grupoAtual.paginas.push(pagina);
  }

  if (grupoAtual) grupos.push(grupoAtual);
  return grupos;
}

function DiarioJornadaSidebar({ paginas, paginaSelecionada, onSelect, loading }) {
  const visiveis = paginas.filter(paginaVisivel);
  const editaveis = visiveis.filter((p) => p.editavel);
  const concluidas = visiveis.filter((p) => p.concluida).length;
  const grupos = agruparPaginas(visiveis);

  return (
    <div className="bg-white h-full overflow-y-auto border-r border-gray-200">
      <div className="px-6 py-4 sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <NotebookPen className="w-9 h-9 text-violet-700" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Jornada SWOT</h2>
            <p className="text-sm text-gray-500">
              {concluidas} de {editaveis.length} concluídas
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {loading && (
          <p className="text-sm text-gray-500 text-center py-8">Carregando páginas…</p>
        )}

        {!loading && editaveis.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8 px-2">
            Complete os exercícios de um traço na SWOT para desbloquear páginas do diário.
          </p>
        )}

        {grupos.map((grupo) => (
          <div key={grupo.chave}>
            <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 px-2 py-1 rounded-lg border ${COR_QUADRANTE[grupo.chave] ?? COR_QUADRANTE.geral}`}>
              {grupo.titulo}
            </h3>
            <div className="space-y-1">
              {grupo.paginas.map((pagina) => {
                const selecionada = paginaSelecionada?.chave === pagina.chave;
                const podeAbrir = pagina.editavel;
                return (
                  <button
                    key={pagina.chave}
                    type="button"
                    onClick={() => podeAbrir && onSelect(pagina)}
                    disabled={!podeAbrir}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                      selecionada
                        ? 'bg-violet-100 border-l-4 border-violet-600 text-violet-900 font-semibold'
                        : !podeAbrir
                          ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400'
                          : 'hover:bg-violet-50 text-gray-800 border border-transparent hover:border-violet-200'
                    }`}
                  >
                    {pagina.concluida ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : pagina.arquivada ? (
                      <Archive className="w-4 h-4 text-gray-500 shrink-0" />
                    ) : !podeAbrir ? (
                      <Lock className="w-4 h-4 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-violet-400 shrink-0" />
                    )}
                    <span className="text-sm line-clamp-2">
                      {pagina.titulo}
                      {pagina.arquivada && (
                        <span className="ml-1 text-xs text-gray-500">(arquivada)</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiarioJornadaSidebar;
