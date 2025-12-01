import { useState } from 'react';
import { Eye, X } from 'lucide-react';

function ExplicacaoCard({ explicacao, tipo = 'explicacao' }) {
  const [mostrar, setMostrar] = useState(false);

  if (!explicacao) return null;

  const titulo = tipo === 'exemplo' ? 'Exemplo detalhado:' : 'Explicação detalhada:';

  return (
    <>
        <div className="mt-4 p-4 bg-violet-50 border-l-4 border-violet-500 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-violet-800 font-semibold text-sm mb-2">{titulo}</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{explicacao}</p>
            </div>
          </div>
        </div>
    </>
  );
}

export default ExplicacaoCard;

