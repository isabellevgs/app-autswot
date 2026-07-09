function ProgressBar({ perguntaAtual, totalRespondiveis, completadas = 0 }) {
  const total = totalRespondiveis || 1;
  const porcentagem = Math.round((completadas / total) * 100);
  const larguraBarra = `${porcentagem}%`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 text-sm font-medium">
          Pergunta {perguntaAtual} de {totalRespondiveis}
        </span>
        <span className="text-gray-600 text-sm font-medium">
          {porcentagem}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-violet-600 to-violet-700 h-3 rounded-full transition-all duration-500"
          style={{ width: larguraBarra }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
