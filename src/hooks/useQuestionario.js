import { useState, useEffect, useRef } from 'react';

export function useQuestionario(perguntas, respostasSalvas = {}, loadingRespostas = true) {
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [frequencia, setFrequencia] = useState(null);
  const [intensidade, setIntensidade] = useState(null);
  const inicializadoRef = useRef(false);

  const perguntaAtualData = perguntas[perguntaAtualIndex];
  const perguntaAtual = perguntaAtualIndex + 1;
  const totalPerguntas = perguntas.length;

  // Encontrar a última pergunta respondida e navegar para ela na primeira carga
  useEffect(() => {
    // Só executa quando as perguntas estão carregadas e as respostas salvas terminaram de carregar
    if (perguntas.length === 0 || loadingRespostas) {
      return;
    }

    // Se já foi inicializado, não faz nada (evita navegar novamente quando respostasSalvas mudar)
    if (inicializadoRef.current) {
      return;
    }

    // Função para verificar se uma pergunta foi respondida
    const perguntaFoiRespondida = (pergunta) => {
      if (!pergunta || !pergunta.id) return false;
      const key = `${pergunta.tipo}-${pergunta.id}`;
      const respostaSalva = respostasSalvas[key];
      
      if (!respostaSalva) return false;
      
      // Considera respondida se tem pelo menos uma resposta, frequência ou intensidade
      return !!(
        respostaSalva.resposta !== null ||
        respostaSalva.frequencia !== null ||
        respostaSalva.intensidade !== null
      );
    };

    // Encontrar o índice da última pergunta respondida
    let ultimoIndexRespondido = -1;
    for (let i = perguntas.length - 1; i >= 0; i--) {
      if (perguntaFoiRespondida(perguntas[i])) {
        ultimoIndexRespondido = i;
        break;
      }
    }

    // Se encontrou uma pergunta respondida, navegar para ela
    if (ultimoIndexRespondido >= 0) {
      setPerguntaAtualIndex(ultimoIndexRespondido);
    }

    // Marca como inicializado apenas depois de verificar as respostas salvas
    inicializadoRef.current = true;
  }, [perguntas, respostasSalvas, loadingRespostas]);

  // Carregar resposta salva quando mudar de pergunta
  useEffect(() => {
    if (!perguntaAtualData || !perguntaAtualData.id) return;

    const key = `${perguntaAtualData.tipo}-${perguntaAtualData.id}`;
    const respostaSalva = respostasSalvas[key];

    if (respostaSalva) {
      // Carregar valores salvos, garantindo que null seja tratado corretamente
      setResposta(respostaSalva.resposta ?? null);
      setFrequencia(respostaSalva.frequencia ?? null);
      setIntensidade(respostaSalva.intensidade ?? null);
    } else {
      // Resetar apenas se não houver resposta salva
      setResposta(null);
      setFrequencia(null);
      setIntensidade(null);
    }
  }, [perguntaAtualIndex, perguntaAtualData?.id, perguntaAtualData?.tipo, respostasSalvas]);

  // Verificar se a pergunta tem intensidade disponível
  const perguntaTemIntensidade = (() => {
    if (!perguntaAtualData) return false;
    
    if (perguntaAtualData.tipo === 'CH') {
      return !!(
        perguntaAtualData.perguntaIntensidade ||
        perguntaAtualData.intensidadeLeve ||
        perguntaAtualData.intensidadeModerada ||
        perguntaAtualData.intensidadeAlta
      );
    }
    
    if (perguntaAtualData.tipo === 'SH') {
      return true;
    }
    
    return false;
  })();

  // Função para avançar para próxima pergunta
  const avancarPergunta = () => {
    if (perguntaAtualIndex < perguntas.length - 1) {
      setPerguntaAtualIndex(perguntaAtualIndex + 1);
    }
  };

  // Função para voltar para pergunta anterior
  const voltarPergunta = () => {
    if (perguntaAtualIndex > 0) {
      setPerguntaAtualIndex(perguntaAtualIndex - 1);
    }
  };

  // Validar se pode avançar
  const podeAvançar = () => {
    if (perguntaAtualIndex >= perguntas.length - 1) return false;
    if (!perguntaAtualData) return false;

    // Todas as perguntas precisam de resposta sim/não
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
  };

  return {
    perguntaAtualIndex,
    setPerguntaAtualIndex,
    resposta,
    setResposta,
    frequencia,
    setFrequencia,
    intensidade,
    setIntensidade,
    perguntaAtualData,
    perguntaAtual,
    totalPerguntas,
    perguntaTemIntensidade,
    avancarPergunta,
    voltarPergunta,
    podeAvançar
  };
}

