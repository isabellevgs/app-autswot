/**
 * Verifica se uma resposta está completa e válida
 */
function respostaEstaCompleta(pergunta, respostaSalva) {
  if (!respostaSalva) return false;

  const { resposta, frequencia, intensidade } = respostaSalva;

  // Todas as perguntas precisam de resposta sim/não
  if (!resposta) return false;

  // Se resposta é "não", está completa
  if (resposta === 'nao') return true;

  // Se resposta é "sim", precisa de frequência (e intensidade para SH/CH)
  if (resposta === 'sim') {
    const temIntensidade = pergunta.tipo === 'SH' || pergunta.tipo === 'CH';
    if (temIntensidade) {
      return !!intensidade && !!frequencia;
    }
    return !!frequencia;
  }

  return false;
}

/**
 * Verifica se o questionário foi completamente respondido
 */
export function questionarioEstaCompleto(perguntas, respostasSalvas) {
  if (!perguntas || perguntas.length === 0) return false;
  if (!respostasSalvas || Object.keys(respostasSalvas).length === 0) return false;

  // Verificar se todas as perguntas têm respostas válidas
  const todasRespondidas = perguntas.every(pergunta => {
    const key = `${pergunta.tipo}-${pergunta.id}`;
    const respostaSalva = respostasSalvas[key];
    return respostaEstaCompleta(pergunta, respostaSalva);
  });

  return todasRespondidas;
}

