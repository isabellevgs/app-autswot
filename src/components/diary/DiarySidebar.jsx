import { useState, useEffect, useRef } from 'react';
import { NotebookPen, Trash2 } from 'lucide-react';

// Componente de menu lateral do diário

function DiarySidebar({ entries, selectedDate, onSelectDate, onCreateNew, onDelete }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFilterOpen]);
  
  // Agrupar entradas por mês
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthKey,
        monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        entries: []
      };
    }
    acc[monthKey].entries.push(entry);
    return acc;
  }, {});

  // Filtro por mês
  const filteredEntries = selectedMonth 
    ? { [selectedMonth]: groupedEntries[selectedMonth] }
    : groupedEntries;

  const handleFilterClick = () => {
    if (selectedMonth) {
      setSelectedMonth(null);
      setIsFilterOpen(false);
    } else {
      setIsFilterOpen(!isFilterOpen);
    }
  };

  const handleMonthSelect = (monthKey) => {
    setSelectedMonth(monthKey);
    setIsFilterOpen(false);
  };

  const totalEntries = Object.values(filteredEntries).reduce((sum, month) => sum + (month?.entries?.length || 0), 0);

  return (
      <div className="bg-white h-full overflow-y-auto relative border-r border-gray-200">
        
      <div className="px-6 py-4 sticky top-0 z-10 border-b border-gray-200">

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
              <NotebookPen className='w-10 h-10 text-black'/>
            <div>
              <h2 className="text-xl font-bold text-black">Meu diário</h2>
              <p className="text-sm text-black/80">{totalEntries} {totalEntries === 1 ? 'entrada' : 'entradas'}</p>
            </div>
          </div>

          <button
            onClick={onCreateNew}
            className="bg-white hover:bg-gray-50 text-violet-700 px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 border-2 border-violet-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo
          </button>
        </div>

        {/* Filtro */}
        <div className="relative mt-2" ref={dropdownRef}>
          <button
            onClick={handleFilterClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-violet-700 border-2 border-violet-500 font-semibold transition-all shadow-md hover:shadow-lg"
            title={selectedMonth ? "Mostrar todos os meses" : "Filtrar por mês"}
          >
            <NotebookPen className="w-5 h-5 text-violet-700" />
            <span className="text-sm font-medium">
              {selectedMonth ? 'Limpar filtro' : 'Filtrar por mês'}
            </span>
            {selectedMonth && (
              <svg className="w-4 h-4 text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>

          {/* Dropdown de meses */}
          {isFilterOpen && !selectedMonth && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[240px] max-h-[300px] overflow-y-auto">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 mb-1">
                  Filtrar por mês
                </div>
                {Object.entries(groupedEntries)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([key, { monthName, entries: monthEntries }]) => (
                    <button
                      key={key}
                      onClick={() => handleMonthSelect(key)}
                      className="w-full text-left px-4 py-2.5 hover:bg-violet-50 text-gray-700 hover:text-violet-700 rounded-lg font-medium transition-all flex items-center justify-between group"
                    >
                      <span>{monthName}</span>
                      <span className="text-xs text-gray-500 group-hover:text-violet-500">
                        {monthEntries.length}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de filtro ativo */}
      {selectedMonth && groupedEntries[selectedMonth] && (
        <div className="mx-6 mt-4 mb-3">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-600 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-violet-900">
                      {groupedEntries[selectedMonth].monthName}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-violet-600 text-white rounded-full font-semibold">
                      {groupedEntries[selectedMonth].entries.length}
                    </span>
                  </div>
                  <p className="text-xs text-violet-600 mt-0.5">
                    {groupedEntries[selectedMonth].entries.length === 1 ? 'entrada encontrada' : 'entradas encontradas'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da lista */}
      <div className="p-6 space-y-6">
        {Object.entries(filteredEntries)
          .sort((a, b) => b[0].localeCompare(a[0])) // Ordenar por mês, mais recente primeiro
          .map(([key, data]) => {
            if (!data) return null;
            const { monthName, entries: monthEntries } = data;
            return (
              <div key={key}>
                <div className="mb-3 pb-2 border-b-2 border-gray-200">
                  <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {monthName}
                  </h3>
                </div>

                <div className="space-y-2">
                  {monthEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`w-full px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-2 ${
                        selectedDate?.id === entry.id
                          ? 'bg-gradient-to-r from-violet-100 to-violet-50 border-l-4 border-violet-600 text-violet-900 font-semibold shadow-md transform scale-[1.02]'
                          : 'bg-gray-50 border border-gray-200 hover:bg-violet-50 hover:border-violet-300 hover:shadow-sm'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <button
                        onClick={() => onSelectDate(entry)}
                        className="flex-1 text-left flex items-center gap-2.5"
                      >
                        <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                          selectedDate?.id === entry.id 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-gray-200 text-gray-600 group-hover:bg-violet-200 group-hover:text-violet-700'
                        }`}>
                          <svg 
                            className="w-3.5 h-3.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-sm">{entry.formattedDate}</span>
                      </button>
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Tem certeza que deseja excluir esta entrada?')) {
                              onDelete(entry.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                          title="Excluir entrada"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {Object.keys(filteredEntries).length === 0 && (
          <div className="text-center mt-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium text-base">Nenhuma nota encontrada</p>
            <p className="text-gray-400 text-sm mt-1">Clique em "Nova Nota" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiarySidebar;

