const EMAIL_PRISCILA = 'priscila.beni.phd@gmail.com';

function ModalRedefinirSenhaLogin({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-redefinir-senha-titulo"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Fechar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="modal-redefinir-senha-titulo" className="text-xl font-bold text-gray-900 mb-4 pr-8">
          Redefinir senha
        </h2>

        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Para redefinir sua senha de acesso ao AutSWOT, entre em contato com a Priscila Beni via e-mail
            informando o endereço de e-mail cadastrado no seu usuário.
          </p>
          <p>
            E-mail:{' '}
            <a
              href={`mailto:${EMAIL_PRISCILA}`}
              className="font-semibold text-violet-700 underline hover:text-violet-800"
            >
              {EMAIL_PRISCILA}
            </a>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRedefinirSenhaLogin;
