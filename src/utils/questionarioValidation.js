/**
 * Utilitários centralizados para validação do questionário.
 * Toda lógica de completude/avanço deve usar estas funções.
 */

/** Limite de paginação compartilhado entre hooks que listam perguntas. */
export const QUESTIONARIO_PAGE_LIMIT = 500;

/** Verifica se a pergunta exibe e exige campo de intensidade. */
export function perguntaTemIntensidade(pergunta) {
  if (!pergunta) return false;

  if (pergunta.tipo === 'SH') return true;

  if (pergunta.tipo === 'CH') {
    return !!(
      pergunta.perguntaIntensidade ||
      pergunta.intensidadeLeve ||
      pergunta.intensidadeModerada ||
      pergunta.intensidadeAlta
    );
  }

  return false;
}

/**
 * Verifica se uma resposta está completa e válida.
 * @param {object} pergunta — metadados da pergunta (tipo, campos de intensidade CH, etc.)
 * @param {{ resposta?, frequencia?, intensidade? } | null} dados
 */
export function respostaEstaCompleta(pergunta, dados) {
  if (!pergunta || !dados) return false;

  const { resposta, frequencia, intensidade } = dados;

  if (!resposta) return false;
  if (resposta === 'nao') return true;

  if (resposta === 'sim') {
    if (!frequencia) return false;
    if (perguntaTemIntensidade(pergunta)) {
      return !!intensidade;
    }
    return true;
  }

  return false;
}

/** CH cuja história social não carregou — excluída da completude do questionário. */
export function perguntaChHistoriaIndisponivel(pergunta) {
  return pergunta?.tipo === 'CH' && !!pergunta.historiaIndisponivel;
}

/** Total de perguntas que o usuário pode/deve responder. */
export function contarPerguntasRespondiveis(perguntas) {
  if (!perguntas?.length) return 0;
  return perguntas.filter((p) => !perguntaChHistoriaIndisponivel(p)).length;
}

/** Verifica se o usuário pode avançar/finalizar a pergunta atual. */
export function podeAvançarPergunta(perguntaAtualData, resposta, frequencia, intensidade) {
  return respostaEstaCompleta(perguntaAtualData, { resposta, frequencia, intensidade });
}

export function estaDesabilitado(
  perguntaAtualData,
  resposta,
  frequencia,
  intensidade,
) {
  if (!perguntaAtualData) return true;

  if (perguntaChHistoriaIndisponivel(perguntaAtualData)) return false;

  if (!podeAvançarPergunta(perguntaAtualData, resposta, frequencia, intensidade)) {
    return true;
  }

  return false;
}

/** Verifica se o questionário foi completamente respondido. */
export function questionarioEstaCompleto(perguntas, respostasSalvas) {
  if (!perguntas?.length) return false;
  if (!respostasSalvas || Object.keys(respostasSalvas).length === 0) return false;

  return perguntas.every((pergunta) => {
    if (perguntaChHistoriaIndisponivel(pergunta)) return true;
    const key = `${pergunta.tipo}-${pergunta.id}`;
    return respostaEstaCompleta(pergunta, respostasSalvas[key]);
  });
}

/** Conta quantas perguntas têm resposta completa. */
export function contarRespostasCompletas(perguntas, respostasSalvas) {
  if (!perguntas?.length) return 0;

  return perguntas.reduce((acc, pergunta) => {
    if (perguntaChHistoriaIndisponivel(pergunta)) return acc;
    const key = `${pergunta.tipo}-${pergunta.id}`;
    return acc + (respostaEstaCompleta(pergunta, respostasSalvas[key]) ? 1 : 0);
  }, 0);
}

/** Retorna o índice respondível (1-based) da pergunta no índice `index`. */
export function indiceRespondivelAtual(perguntas, index) {
  if (!perguntas?.length || index < 0) return 0;

  let count = 0;
  for (let i = 0; i <= index && i < perguntas.length; i++) {
    if (!perguntaChHistoriaIndisponivel(perguntas[i])) {
      count += 1;
    }
  }
  return count;
}

/** Retorna o índice da primeira pergunta incompleta, ou -1 se todas estão completas. */
export function indicePrimeiraIncompleta(perguntas, respostasSalvas) {
  if (!perguntas?.length) return 0;

  for (let i = 0; i < perguntas.length; i++) {
    if (perguntaChHistoriaIndisponivel(perguntas[i])) continue;

    const key = `${perguntas[i].tipo}-${perguntas[i].id}`;
    if (!respostaEstaCompleta(perguntas[i], respostasSalvas[key])) {
      return i;
    }
  }

  return -1;
}
