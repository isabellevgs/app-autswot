import { SwotCard } from '../index';
import { useState, useCallback } from 'react';
import { SWOT_ORDEM } from '../../constants/swotConfig';
import {
  DESBLOQUEIO_SEQUENCIAL_ATIVO,
  QUADRANTE_POR_SECAO,
  SECAO_POR_QUADRANTE,
  quadranteEstaDesbloqueado,
  tracosFaltandoParaDesbloquear,
} from '../../constants/swotQuadrantes';
import SwotTracoModal from './SwotTracoModal';

function totaisPorQuadrante(dadosSwot) {
  return Object.fromEntries(
    Object.entries(SECAO_POR_QUADRANTE).map(([quadrante, secao]) => [
      quadrante,
      dadosSwot?.[secao]?.items?.length ?? 0,
    ]),
  );
}

function textoProgressoQuadrante(quadrante, progresso, dadosSwot) {
  const secao = SECAO_POR_QUADRANTE[quadrante];
  const total = progresso?.[quadrante]?.totalTracos ?? dadosSwot?.[secao]?.items?.length ?? 0;
  const concluidos = progresso?.[quadrante]?.concluidos ?? 0;

  if (total <= 0) return null;
  if (quadrante === 'forca') return `${total} traço${total !== 1 ? 's' : ''}`;
  return `${concluidos}/${total} enviado${concluidos !== 1 ? 's' : ''}`;
}

function calcularStatus(secao, progresso, dadosSwot, progressoIndisponivel) {
  if (!DESBLOQUEIO_SEQUENCIAL_ATIVO) {
    return { bloqueado: false, descricao: 'Clique para expandir seus traços.' };
  }

  const quadrante = QUADRANTE_POR_SECAO[secao];
  const totais = totaisPorQuadrante(dadosSwot);

  if (!progresso) {
    const concluidos = {};
    const bloqueado = progressoIndisponivel || !quadranteEstaDesbloqueado(quadrante, concluidos, totais);
    if (!bloqueado) {
      return { bloqueado: false, descricao: 'Clique para expandir seus traços.' };
    }
    if (progressoIndisponivel) {
      return {
        bloqueado: true,
        descricao: 'Progresso de desbloqueio indisponível. Tente recarregar.',
      };
    }
    const faltam = tracosFaltandoParaDesbloquear(quadrante, concluidos, totais);
    return {
      bloqueado: true,
      descricao: faltam === 0
        ? 'Complete os traços do quadrante anterior para desbloquear.'
        : `Responda mais ${faltam} traço${faltam !== 1 ? 's' : ''} no quadrante anterior para desbloquear.`,
    };
  }

  const p = progresso[quadrante];
  if (!p) return { bloqueado: true, descricao: 'Quadrante bloqueado.' };

  const totalTracosPorQuadrante = Object.fromEntries(
    Object.entries(progresso).map(([q, dados]) => [q, dados.totalTracos ?? totais[q] ?? 0]),
  );
  const concluidosPorQuadrante = Object.fromEntries(
    Object.entries(progresso).map(([q, dados]) => [q, dados.concluidos]),
  );

  const desbloqueado = quadranteEstaDesbloqueado(
    quadrante,
    concluidosPorQuadrante,
    totalTracosPorQuadrante,
  );

  if (desbloqueado) {
    return { bloqueado: false, descricao: 'Clique para expandir seus traços.' };
  }

  const faltam = tracosFaltandoParaDesbloquear(
    quadrante,
    concluidosPorQuadrante,
    totalTracosPorQuadrante,
  );

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

function SwotGrid({ dadosSwot, progresso, progressoError, statusPorTraco, onProgressoChange, onRetryProgresso }) {
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
    <div className="space-y-4">
      {progressoError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-amber-900">{progressoError}</p>
          <button
            type="button"
            onClick={onRetryProgresso}
            className="text-sm font-semibold text-amber-800 hover:underline shrink-0"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
      {SWOT_ORDEM.map((secao, index) => {
        const data        = dadosSwot[secao];
        const quadrante   = QUADRANTE_POR_SECAO[secao];
        const status      = calcularStatus(secao, progresso, dadosSwot, !!progressoError);
        const progressoTexto = textoProgressoQuadrante(quadrante, progresso, dadosSwot);
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
              progressoTexto={progressoTexto}
              statusPorTraco={statusPorTraco}
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
    </div>
  );
}

export default SwotGrid;
