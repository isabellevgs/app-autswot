import { useState, useEffect } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { buscarSwotLiberado } from '@/utils/appDataUtils'

function RequireSwotLiberado({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'liberado' | 'bloqueado' | 'erro'

  useEffect(() => {
    let ativo = true

    buscarSwotLiberado().then(({ swotLiberado, erro }) => {
      if (!ativo) return
      if (erro) {
        setStatus('erro')
        return
      }
      setStatus(swotLiberado ? 'liberado' : 'bloqueado')
    })

    return () => { ativo = false }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 size={20} className="animate-spin mr-2" />
        Verificando acesso ao SWOT...
      </div>
    )
  }

  if (status === 'bloqueado') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-slate-600">
        <Lock size={32} className="mb-3 text-slate-400" />
        <p className="font-semibold">Acesso ao SWOT indisponível</p>
        <p className="text-sm text-slate-500 mt-1">
          Seu usuário não tem permissão para acessar esta funcionalidade no momento.
        </p>
      </div>
    )
  }

  if (status === 'erro') {
    return (
      <div className="p-6 text-center text-red-600 text-sm">
        Não foi possível verificar seu acesso ao SWOT. Tente novamente mais tarde.
      </div>
    )
  }

  return children
}

export default RequireSwotLiberado
