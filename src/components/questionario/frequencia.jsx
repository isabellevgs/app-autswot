import Bateria1 from '../../../assets/image1.svg';
import Bateria2 from '../../../assets/image2.svg';
import Bateria3 from '../../../assets/image3.svg';
import Bateria4 from '../../../assets/image4.svg';
import Bateria5 from '../../../assets/image5.svg';
import { FREQUENCIA_LABELS, FREQUENCIA_PERGUNTAS } from '../../constants/frequenciaLabels';

function Frequencia({ frequencia, onFrequenciaChange, tipo = 'SH' }) {
  const imagens = [Bateria1, Bateria2, Bateria3, Bateria4, Bateria5];
  const labels = FREQUENCIA_LABELS[tipo] || FREQUENCIA_LABELS.SH;
  const textoPergunta = FREQUENCIA_PERGUNTAS[tipo] || FREQUENCIA_PERGUNTAS.SH;

  const opcoes = labels.map((label, index) => ({
    valor: index + 1,
    imagem: imagens[index],
    alt: `Bateria ${index + 1}`,
    label
  }));

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <p className="text-gray-800 font-medium text-base sm:text-lg mb-6 text-left">
        {textoPergunta}
      </p>
      
      <div className="flex flex-col items-start gap-6">
        {opcoes.map((opcao) => {
          const selecionado = frequencia === opcao.valor;
          return (
            <label
              key={opcao.valor}
              className="flex flex-row items-center gap-3 cursor-pointer transition-all duration-300"
            >
              <input
                type="checkbox"
                checked={selecionado}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFrequenciaChange && onFrequenciaChange(opcao.valor);
                  } else {
                    onFrequenciaChange && onFrequenciaChange(null);
                  }
                }}
                className="sr-only"
              />
              <div className="flex items-center justify-center transition-all duration-300">
                <img 
                  src={opcao.imagem} 
                  alt={opcao.alt} 
                  className="w-16 h-16"
                />
              </div>
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${selecionado ? 'border-violet-600 bg-violet-600' : 'border-gray-300 bg-white'}
              `}>
                {selecionado && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm sm:text-base text-left ${selecionado ? 'font-semibold text-violet-700' : 'text-gray-600'}`}>
                {opcao.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default Frequencia;

