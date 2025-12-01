// Componente de conteúdo do diário com inputs

function DiaryContent({ selectedEntry, onChange, perguntas = [], loadingPerguntas = false, onSave, saving = false }) {
  if (!selectedEntry) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 mb-6">
            <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma nota selecionada</h3>
          <p className="text-gray-600 text-lg">Selecione uma nota na barra lateral ou crie uma nova para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-violet-50 to-white px-8 py-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedEntry.formattedDate}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-8 space-y-8">
        {loadingPerguntas ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Carregando perguntas...</p>
          </div>
        ) : perguntas.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma pergunta configurada</h3>
            <p className="text-gray-600">Entre em contato com o administrador para configurar suas perguntas do diário.</p>
          </div>
        ) : (
          perguntas.map((pergunta, index) => {
            const resposta = selectedEntry.respostas?.[pergunta.id] || '';
            return (
              <div key={pergunta.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <label className="text-gray-900 font-bold text-lg">
                      {pergunta.texto}
                    </label>
                  </div>
                </div>
                <div>
                  <textarea
                    value={resposta}
                    onChange={(e) => onChange(selectedEntry.id, pergunta.id, e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 min-h-[140px] resize-none text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
                    placeholder="Digite sua resposta aqui..."
                  />
                </div>
              </div>
            );
          })
        )}

        {/* Footer com botão de salvar */}
        <div className="pt-6 border-t border-gray-200 flex items-center justify-end">
          <button
            type="button"
            onClick={() => onSave && onSave(selectedEntry)}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiaryContent;
