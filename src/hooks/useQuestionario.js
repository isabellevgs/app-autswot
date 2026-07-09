import { useState, useEffect, useRef, useCallback } from 'react';
import {
  perguntaTemIntensidade,
  podeAvançarPergunta,
  indicePrimeiraIncompleta,
} from '../utils/questionarioValidation';

export function useQuestionario(perguntas, respostasSalvas = {}, loadingRespostas = true) {
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [frequencia, setFrequencia] = useState(null);
  const [intensidade, setIntensidade] = useState(null);
  const inicializadoRef = useRef(false);

  const perguntaAtualData = perguntas[perguntaAtualIndex];
  const perguntaAtual = perguntaAtualIndex + 1;
  const totalPerguntas = perguntas.length;
  const temIntensidade = perguntaTemIntensidade(perguntaAtualData);

  // Navegar para a primeira pergunta incompleta na carga inicial
  useEffect(() => {
    if (perguntas.length === 0 || loadingRespostas) {
      return;
    }

    if (inicializadoRef.current) {
      return;
    }

    const primeiroIncompleto = indicePrimeiraIncompleta(perguntas, respostasSalvas);
    if (primeiroIncompleto >= 0) {
      setPerguntaAtualIndex(primeiroIncompleto);
    }

    inicializadoRef.current = true;
  }, [perguntas, respostasSalvas, loadingRespostas]);

  // Carregar resposta salva quando mudar de pergunta
  useEffect(() => {
    if (!perguntaAtualData || !perguntaAtualData.id) return;

    const key = `${perguntaAtualData.tipo}-${perguntaAtualData.id}`;
    const respostaSalva = respostasSalvas[key];

    if (respostaSalva) {
      setResposta(respostaSalva.resposta ?? null);
      setFrequencia(respostaSalva.frequencia ?? null);
      setIntensidade(respostaSalva.intensidade ?? null);
    } else {
      setResposta(null);
      setFrequencia(null);
      setIntensidade(null);
    }
  }, [perguntaAtualIndex, perguntaAtualData?.id, perguntaAtualData?.tipo, respostasSalvas]);

  const avancarPergunta = () => {
    if (perguntaAtualIndex < perguntas.length - 1) {
      setPerguntaAtualIndex(perguntaAtualIndex + 1);
    }
  };

  const voltarPergunta = () => {
    if (perguntaAtualIndex > 0) {
      setPerguntaAtualIndex(perguntaAtualIndex - 1);
    }
  };

  const podeAvançar = () => {
    if (perguntaAtualIndex >= perguntas.length - 1) return false;
    return podeAvançarPergunta(perguntaAtualData, resposta, frequencia, intensidade);
  };

  const handleRespostaChange = (value) => {
    setResposta(value);
    if (perguntaAtualData?.tipo === 'SH' || perguntaAtualData?.tipo === 'CH') {
      setFrequencia(null);
      setIntensidade(null);
    }
  };

  const handleFrequenciaChange = (value) => {
    setFrequencia(value);
    if (perguntaAtualData?.tipo === 'SH' || perguntaAtualData?.tipo === 'CH') {
      setIntensidade(null);
    }
  };

  const reposicionar = useCallback(() => {
    inicializadoRef.current = false;
  }, []);

  return {
    perguntaAtualIndex,
    setPerguntaAtualIndex,
    resposta,
    setResposta,
    handleRespostaChange,
    handleFrequenciaChange,
    frequencia,
    setFrequencia,
    intensidade,
    setIntensidade,
    perguntaAtualData,
    perguntaAtual,
    totalPerguntas,
    perguntaTemIntensidade: temIntensidade,
    avancarPergunta,
    voltarPergunta,
    podeAvançar,
    reposicionar,
  };
}
