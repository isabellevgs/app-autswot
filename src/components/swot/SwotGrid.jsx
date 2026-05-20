import { SwotCard } from '../index';
import { useState, useCallback } from 'react';
import { SWOT_ORDEM } from '../../constants/swotConfig';
import SwotTracoModal from './SwotTracoModal';

// Mapeamento: chave da seção → chave do progresso no backend
const SECAO_PARA_QUADRANTE = {
  ameacas:       'ameaca',
  fraquezas:     'fraqueza',
  oportunidades: 'oportunidade',
  forcas:        'forca',
};

// Thresholds de desbloqueio (espelhados do backend apenas para exibição de "faltam N")
const NECESSARIOS = { ameaca: 5, fraqueza: 3, oportunidade: 2, forca: 0 };

function calcularStatus(secao, progresso) {
  const quadrante = SECAO_PARA_QUADRANTE[secao];

  if (!progresso) {
    // Fallback enquanto o progresso carrega: só ameaças disponível
    return {
      bloqueado: secao !== 'ameacas',
      descricao: secao === 'ameacas'
        ? 'Clique para expandir seus traços.'
        : 'Complete os exercícios do quadrante anterior para desbloquear.',
    };
  }

  const p = progresso[quadrante];
  if (!p) return { bloqueado: true, descricao: 'Quadrante bloqueado.' };

  if (p.desbloqueado) {
    return { bloqueado: false, descricao: 'Clique para expandir seus traços.' };
  }

  // Calcular quantos faltam no quadrante predecessor
  const anterior = {
    fraqueza:     progresso.ameaca,
    oportunidade: progresso.fraqueza,
    forca:        progresso.oportunidade,
  }[quadrante];

  const faltam = anterior ? Math.max(0, anterior.necessarios - anterior.concluidos) : NECESSARIOS[quadrante];

  return {
    bloqueado: true,
    descricao: faltam === 0
      ? 'Complete os exercícios do quadrante anterior para desbloquear.'
      : `Complete mais ${faltam} exercício${faltam !== 1 ? 's' : ''} no quadrante anterior para desbloquear.`,
  };
}

/**
 * Calcula a classe de largura de cada card no grid.
 *
 * Regra visual "1, 1 e 2":
 *   - Grid normal (tudo fechado): 2 colunas × 2 linhas
 *   - Quando um card da linha superior (índices 0-1) é aberto:
 *       → ambos os cards daquela linha viram col-span-2 (cada um ocupa a linha inteira)
 *       → os 2 cards da linha inferior ficam lado a lado (col-span-1 cada)
 *   - Idem para linha inferior (índices 2-3)
 */
function colSpanPara(secaoIndex, expandidos) {
  // Verifica se algum item em qualquer linha está expandido
  const algumExpandidoNaLinha = (linhaInicio) =>
    SWOT_ORDEM.slice(linhaInicio, linhaInicio + 2).some((s) => expandidos[s]);

  const minhaLinha = secaoIndex < 2 ? 0 : 2; // índice inicial da minha linha
  return algumExpandidoNaLinha(minhaLinha) ? 'sm:col-span-2' : '';
}

function SwotGrid({ dadosSwot, progresso, onProgressoChange }) {
  const [expandidos,       setExpandidos]       = useState({});
  const [tracoSelecionado, setTracoSelecionado] = useState(null);
  const [modalAberta,      setModalAberta]       = useState(false);

  const toggleExpandir = useCallback((secao) => {
    setExpandidos((prev) => ({ ...prev, [secao]: !prev[secao] }));
  }, []);

  const handleItemClick = useCallback((item) => {
    setTracoSelecionado(item);
    setModalAberta(true);
  }, []);

  const handleFecharModal = useCallback(() => setModalAberta(false), []);

  const handleSalvoModal = useCallback(() => {
    setModalAberta(false);
    onProgressoChange?.();
  }, [onProgressoChange]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
      {SWOT_ORDEM.map((secao, index) => {
        const data        = dadosSwot[secao];
        const status      = calcularStatus(secao, progresso);
        const isExpandido = !status.bloqueado && !!expandidos[secao];
        const colSpan     = colSpanPara(index, expandidos);

        return (
          <div key={secao} className={colSpan}>
            <SwotCard
              titulo={data.titulo}
              Icon={data.icon}
              items={data.items}
              isExpandido={isExpandido}
              isBloqueado={status.bloqueado}
              onClick={!status.bloqueado ? () => toggleExpandir(secao) : undefined}
              onItemClick={handleItemClick}
              gradient={data.gradient}
              descricao={status.descricao}
            />
          </div>
        );
      })}

      {tracoSelecionado && (
        <SwotTracoModal
          isOpen={modalAberta}
          onClose={handleFecharModal}
          onSalvo={handleSalvoModal}
          tracoInfo={tracoSelecionado}
        />
      )}
    </div>
  );
}

export default SwotGrid;
