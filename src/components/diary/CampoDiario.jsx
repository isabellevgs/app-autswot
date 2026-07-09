function CampoDiario({ id, value, onChange, onBlur, minPalavras, invalid, placeholder }) {
  const n = String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
  const faltam = Math.max(0, minPalavras - n);
  const border = invalid
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-200 focus:ring-violet-500';

  return (
    <div className="space-y-1">
      <textarea
        id={id}
        className={`w-full min-h-[200px] px-6 py-4 border-2 rounded-xl bg-white focus:outline-none focus:ring-2 resize-y text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md ${border}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder ?? 'Escreva sua reflexão aqui…'}
        aria-invalid={invalid}
      />
      <p className="text-xs text-gray-500">
        Mínimo de {minPalavras} palavras para concluir. Atual: {n}{' '}
        {n === 1 ? 'palavra' : 'palavras'}.
      </p>
      {invalid && (
        <p className="text-xs text-red-600 font-medium" role="alert">
          Faltam {faltam} {faltam === 1 ? 'palavra' : 'palavras'} para atingir o mínimo.
        </p>
      )}
    </div>
  );
}

export default CampoDiario;
