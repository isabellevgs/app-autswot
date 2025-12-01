import { useState, useEffect } from 'react';
import { DiarySidebar, DiaryContent } from '../components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function Diario() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [loadingPerguntas, setLoadingPerguntas] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar perguntas e entradas do usuário
  useEffect(() => {
    if (user?.id) {
      loadPerguntas();
      loadEntries();
    }
  }, [user?.id]);

  const loadPerguntas = async () => {
    try {
      setLoadingPerguntas(true);
      const response = await api.get(`/questions/user/${user.id}`);
      // Filtrar apenas perguntas ativas e ordenar por ordem
      const perguntasAtivas = (response.data.questions || [])
        .filter(q => q.ativo !== false)
        .sort((a, b) => a.ordem - b.ordem);
      setPerguntas(perguntasAtivas);
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err);
      setPerguntas([]);
    } finally {
      setLoadingPerguntas(false);
    }
  };

  const loadEntries = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingEntries(true);
      const response = await api.get(`/diary/user/${user.id}`);
      const loadedEntries = (response.data.entries || []).map(entry => {
        const date = new Date(entry.date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        
        // Converter respostas do formato da API para o formato local
        const respostas = {};
        if (entry.answers) {
          entry.answers.forEach(answer => {
            respostas[answer.questionId] = answer.texto || '';
          });
        }
        
        return {
          id: entry.id,
          date: date,
          formattedDate: `${day}/${month}`,
          respostas,
        };
      });
      
      // Ordenar por data (mais recente primeiro)
      loadedEntries.sort((a, b) => b.date - a.date);
      setEntries(loadedEntries);
    } catch (err) {
      console.error('Erro ao carregar entradas:', err);
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleCreateNew = async () => {
    if (!user?.id) return;
    
    // Buscar perguntas antes de criar nova entrada
    if (perguntas.length === 0) {
      await loadPerguntas();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar para início do dia
    
    try {
      // Verificar se já existe entrada para hoje
      const existingEntry = entries.find(e => {
        const eDate = new Date(e.date);
        eDate.setHours(0, 0, 0, 0);
        return eDate.getTime() === today.getTime();
      });

      if (existingEntry) {
        setSelectedEntry(existingEntry);
        return;
      }

      // Criar objeto de respostas baseado nas perguntas
      const respostas = {};
      perguntas.forEach((pergunta) => {
        respostas[pergunta.id] = '';
      });

      // Criar entrada na API
      const response = await api.post('/diary', {
        date: today.toISOString(),
        answers: respostas,
      });

      const newEntry = {
        id: response.data.entry.id,
        date: new Date(response.data.entry.date),
        formattedDate: `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`,
        respostas,
      };

      setEntries([newEntry, ...entries]);
      setSelectedEntry(newEntry);
    } catch (err) {
      console.error('Erro ao criar entrada:', err);
      alert('Erro ao criar nova entrada. Tente novamente.');
    }
  };

  const handleSelectDate = (entry) => {
    // Garantir que a entrada tenha a estrutura de respostas
    if (entry && !entry.respostas) {
      // Migrar estrutura antiga (question1, question2, etc) para nova estrutura
      const respostas = {};
      perguntas.forEach((pergunta, index) => {
        const oldKey = `question${index + 1}`;
        respostas[pergunta.id] = entry[oldKey] || '';
      });
      entry.respostas = respostas;
    }
    setSelectedEntry(entry);
  };

  const handleContentChange = (entryId, questionId, value) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        const updatedRespostas = {
          ...(entry.respostas || {}),
          [questionId]: value
        };
        return { ...entry, respostas: updatedRespostas };
      }
      return entry;
    }));

    // Atualizar entrada selecionada
    if (selectedEntry?.id === entryId) {
      const updatedRespostas = {
        ...(selectedEntry.respostas || {}),
        [questionId]: value
      };
      setSelectedEntry({ ...selectedEntry, respostas: updatedRespostas });
    }
  };

  const handleSave = async (entry) => {
    if (!entry || !entry.id) return;
    
    try {
      setSaving(true);
      
      // Converter respostas para o formato da API
      const answers = {};
      Object.entries(entry.respostas || {}).forEach(([questionId, texto]) => {
        if (texto && texto.trim()) {
          answers[questionId] = texto;
        }
      });

      // Atualizar entrada na API
      await api.put(`/diary/${entry.id}`, {
        answers,
      });

      // Atualizar estado local
      setEntries(entries.map(e => {
        if (e.id === entry.id) {
          return { ...e, ...entry };
        }
        return e;
      }));
      
      // Feedback visual de sucesso
      console.log('Entrada salva com sucesso');
    } catch (err) {
      console.error('Erro ao salvar entrada:', err);
      alert('Erro ao salvar entrada. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!entryId) return;
    
    try {
      // Deletar entrada na API
      await api.delete(`/diary/${entryId}`);
      
      // Remover entrada da lista
      const updatedEntries = entries.filter(e => e.id !== entryId);
      setEntries(updatedEntries);
      
      // Se a entrada deletada estava selecionada, limpar seleção
      if (selectedEntry?.id === entryId) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error('Erro ao deletar entrada:', err);
      alert('Erro ao deletar entrada. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Menu Lateral */}
      <div className="w-full lg:w-1/3 flex-shrink-0 mt-3">
        <DiarySidebar
          entries={entries}
          selectedDate={selectedEntry}
          onSelectDate={handleSelectDate}
          onCreateNew={handleCreateNew}
          onDelete={handleDelete}
        />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 py-8 lg:py-10 px-8 lg:px-12">
        <DiaryContent
          selectedEntry={selectedEntry}
          onChange={handleContentChange}
          perguntas={perguntas}
          loadingPerguntas={loadingPerguntas}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  );
}

export default Diario;
