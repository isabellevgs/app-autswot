import { Save, ArrowLeft, ArrowRight } from 'lucide-react';

function BotoesNavegacao({
  perguntaAtualIndex,
  totalPerguntas,
  desabilitado,
  onVoltar,
  onAnterior,
  onSalvarFechar,
  onAvançar
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {perguntaAtualIndex === 0 ? (
        <button 
          onClick={onVoltar}
          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      ) : (
        <button 
          onClick={onAnterior}
          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Anterior
        </button>
      )}
      
      <button 
        onClick={onSalvarFechar}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        Salvar e Fechar
      </button>
      
      <button 
        onClick={onAvançar}
        disabled={desabilitado}
        className={`
          w-full sm:w-auto font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 flex items-center justify-center gap-2
          ${!desabilitado
            ? 'bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white hover:shadow-xl focus:ring-violet-300 cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {perguntaAtualIndex >= totalPerguntas - 1 ? 'Finalizar' : 'Avançar'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default BotoesNavegacao;

