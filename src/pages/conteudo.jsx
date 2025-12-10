import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageTitle, PageContent, CardPost, Search, EmptyState } from '../components'
import api from '../services/api'

function Conteudo() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchTimeoutRef = useRef(null)

  // Carregar posts ao montar o componente
  useEffect(() => {
    loadPosts('')
  }, [])

  // Debounce para busca - aguarda 500ms após parar de digitar
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadPosts(searchTerm)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm])

  const loadPosts = async (search = '') => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        page: '1',
        limit: '100',
        ...(search.trim() && { search: search.trim() }),
      }
      const response = await api.get('/posts', { params })
      setCards(response.data.posts || [])
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao carregar posts. Tente novamente.'
      setError(errorMessage)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (card) => {
    navigate(`/conteudo/post/${card.id}`)
  }

  return (
    <PageContainer>
      <PageTitle>CONTEÚDO</PageTitle>
      
      <PageContent>
        <Search onSearch={setSearchTerm} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-center text-slate-500">Carregando posts...</div>
        ) : cards.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(card => (
              <CardPost
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState 
              message={searchTerm ? 'Nenhum post encontrado.' : 'Nenhum post ainda.'} 
            />
          </div>
        )}
      </PageContent>
    </PageContainer>
  )
}

export default Conteudo

