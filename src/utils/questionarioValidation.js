/**
 * Utilitários para validação do questionário
 */

export function podeAvançarPergunta(perguntaAtualData, resposta, frequencia, intensidade, perguntaTemIntensidade) {
  if (!perguntaAtualData) return false;

  // Perguntas FO e F só precisam de frequência
  if (perguntaAtualData.tipo === 'FO' || perguntaAtualData.tipo === 'F') {
    return !!frequencia;
  }

  // Outras perguntas precisam de resposta
  if (!resposta) return false;

  // Se resposta é "não", pode avançar
  if (resposta === 'nao') return true;

  // Se resposta é "sim", precisa de intensidade ou frequência
  if (resposta === 'sim') {
    if (perguntaTemIntensidade) {
      return !!intensidade;
    }
    return !!frequencia;
  }

  return false;
}

export function estaDesabilitado(perguntaAtualIndex, totalPerguntas, perguntaAtualData, resposta, frequencia, intensidade, perguntaTemIntensidade) {
  // Se não tem pergunta atual, desabilita
  if (!perguntaAtualData) return true;
  
  // Se não pode avançar (resposta inválida), desabilita
  if (!podeAvançarPergunta(perguntaAtualData, resposta, frequencia, intensidade, perguntaTemIntensidade)) {
    return true;
  }
  
  // Se é a última pergunta e tem resposta válida, habilita o botão "Finalizar"
  if (perguntaAtualIndex >= totalPerguntas - 1) {
    return false;
  }
  
  // Para outras perguntas, só habilita se pode avançar
  return false;
}

