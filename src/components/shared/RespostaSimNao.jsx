import { Check } from 'lucide-react';

function RespostaSimNao({ resposta, onRespostaChange }) {
  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      <label 
        className={`
          relative flex items-center justify-center py-3 px-6 rounded-lg border-2 cursor-pointer transition-all duration-300
          ${resposta === 'sim' 
            ? 'border-violet-600 bg-violet-50 shadow-md' 
            : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-sm'
          }
        `}
      >
        <input
          type="radio"
          name="resposta"
          value="sim"
          checked={resposta === 'sim'}
          onChange={(e) => onRespostaChange(e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center gap-2">
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${resposta === 'sim' ? 'border-violet-600 bg-violet-600' : 'border-gray-300 bg-white'}
          `}>
            {resposta === 'sim' && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
          <span className={`font-semibold text-lg ${resposta === 'sim' ? 'text-violet-700' : 'text-gray-700'}`}>
            Sim
          </span>
        </div>
      </label>

      <label 
        className={`
          relative flex items-center justify-center py-3 px-6 rounded-lg border-2 cursor-pointer transition-all duration-300
          ${resposta === 'nao' 
            ? 'border-violet-600 bg-violet-50 shadow-md' 
            : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-sm'
          }
        `}
      >
        <input
          type="radio"
          name="resposta"
          value="nao"
          checked={resposta === 'nao'}
          onChange={(e) => onRespostaChange(e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center gap-2">
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${resposta === 'nao' ? 'border-violet-600 bg-violet-600' : 'border-gray-300 bg-white'}
          `}>
            {resposta === 'nao' && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
          <span className={`font-semibold text-lg ${resposta === 'nao' ? 'text-violet-700' : 'text-gray-700'}`}>
            Não
          </span>
        </div>
      </label>
    </div>
  );
}

export default RespostaSimNao;

