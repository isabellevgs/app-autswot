import { createPortal } from 'react-dom'
import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

function AcessoBloqueadoModal({ isOpen }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-100">
            <Lock className="w-7 h-7 text-red-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">Acesso bloqueado</h2>
            <p className="text-sm text-gray-600">
              O acesso a esta área foi bloqueado pelo administrador. Entre em contato com a
              equipe responsável caso acredite que isso seja um engano.
            </p>
          </div>

          <Link
            to="/"
            className="mt-2 px-6 py-2.5 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AcessoBloqueadoModal
