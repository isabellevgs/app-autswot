import { SwotCard } from '../index';
import { useState, useCallback } from 'react';
import { SWOT_ORDEM } from '../../constants/swotConfig';
import {
  DESBLOQUEIO_SEQUENCIAL_ATIVO,
  QUADRANTE_POR_SECAO,
  tracosFaltandoParaDesbloquear,
} from '../../constants/swotQuadrantes';
import SwotTracoModal from './SwotTracoModal';

function calcularStatus(secao, progresso) {
  if (!DESBLOQUEIO_SEQUENCIAL_ATIVO) {
    return { bloqueado: false, descricao: 'Clique para expandir seus traços.' };
  }

  const quadrante = QUADRANTE_POR_SECAO[secao];

  if (!progresso) {
    return {
      bloqueado: secao !== 'ameacas',
      descricao: secao === 'ameacas'
        ? 'Clique para expandir seus traços.'
        : 'Complete os traços do quadrante anterior para desbloquear.',
    };
  }

  const p = progresso[quadrante];
  if (!p) return { bloqueado: true, descricao: 'Quadrante bloqueado.' };

  if (p.desbloqueado) {
    return { bloqueado: false, descricao: 'Clique para expandir seus traços.' };
  }

  const concluidosPorQuadrante = Object.fromEntries(
    Object.entries(progresso).map(([q, dados]) => [q, dados.concluidos]),
  );
  const faltam = tracosFaltandoParaDesbloquear(quadrante, concluidosPorQuadrante);

  return {
    bloqueado: true,
    descricao: faltam === 0
      ? 'Complete os traços do quadrante anterior para desbloquear.'
      : `Responda mais ${faltam} traço${faltam !== 1 ? 's' : ''} no quadrante anterior para desbloquear.`,
  };
}

function colSpanPara(secaoIndex, expandidos) {
  const algumExpandidoNaLinha = (linhaInicio) =>
    SWOT_ORDEM.slice(linhaInicio, linhaInicio + 2).some((s) => expandidos[s]);

  const minhaLinha = secaoIndex < 2 ? 0 : 2;
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
