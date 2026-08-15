import { useState, useEffect } from 'react';
import { buscarTcle } from '../../utils/appDataUtils.js';

function TermosModal({ isOpen, onClose }) {
  const [tcle, setTcle] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setCarregando(true);
    setErro(null);

    buscarTcle().then(({ tcle, erro }) => {
      setTcle(tcle);
      setErro(erro);
      setCarregando(false);
    });
  }, [isOpen]);

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
          {carregando && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            </div>
          )}

          {!carregando && erro && (
            <p className="text-sm text-red-600 text-center py-8">{erro}</p>
          )}

          {!carregando && !erro && tcle && (
            <div className="prose prose-gray max-w-none space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {tcle}
            </div>
          )}

          {!carregando && !erro && !tcle && (
            <p className="text-sm text-gray-500 text-center py-8">
              Termo de consentimento não disponível no momento.
            </p>
          )}
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
