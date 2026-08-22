import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { buscarAcessoLiberado } from '@/utils/appDataUtils'

function RequireAcessoLiberado({ redirectTo = '/acesso-bloqueado' }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'liberado' | 'bloqueado' | 'erro'

  useEffect(() => {
    let ativo = true

    buscarAcessoLiberado().then(({ acessoLiberado, erro }) => {
      if (!ativo) return
      if (erro) {
        setStatus('erro')
        return
      }
      setStatus(acessoLiberado ? 'liberado' : 'bloqueado')
    })

    return () => { ativo = false }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 size={20} className="animate-spin mr-2" />
        Verificando acesso...
      </div>
    )
  }

  if (status === 'bloqueado') {
    return <Navigate to={redirectTo} replace />
  }

  if (status === 'erro') {
    return (
      <div className="p-6 text-center text-red-600 text-sm">
        Não foi possível verificar seu acesso. Tente novamente mais tarde.
      </div>
    )
  }

  return <Outlet />
}

export default RequireAcessoLiberado
