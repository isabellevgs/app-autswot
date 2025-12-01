function ProgressBar({ perguntaAtual, totalPerguntas }) {
  const porcentagem = Math.round((perguntaAtual / totalPerguntas) * 100);
  const larguraBarra = `${(perguntaAtual / totalPerguntas) * 100}%`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 text-sm font-medium">
          Pergunta {perguntaAtual} de {totalPerguntas}
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

