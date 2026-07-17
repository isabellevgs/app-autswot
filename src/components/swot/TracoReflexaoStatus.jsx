import { Check, Clock, Hourglass } from 'lucide-react';
import { chaveReflexaoTraco } from '../../utils/reflexaoTracoStatus';

const CONFIG = {
  enviado: {
    Icon: Check,
    label: 'Respostas enviadas',
    className: 'text-emerald-200',
  },
  rascunho: {
    Icon: Hourglass,
    label: 'Salvo sem enviar (rascunho)',
    className: 'text-amber-200',
  },
  pendente: {
    Icon: Clock,
    label: 'Ainda não há reflexão salva',
    className: 'text-white/60',
  },
};

function TracoReflexaoStatus({ status = 'pendente', className = '' }) {
  const { Icon, label, className: iconClass } = CONFIG[status] ?? CONFIG.pendente;

  return (
    <span
      className={`inline-flex shrink-0 ${className}`}
      title={label}
      aria-label={label}
    >
      <Icon className={`w-5 h-5 ${iconClass}`} strokeWidth={2.5} />
    </span>
  );
}

export function obterStatusTraco(item, statusPorTraco) {
  if (!item) return null;
  if (!statusPorTraco) return 'pendente';
  return statusPorTraco[chaveReflexaoTraco(item)] ?? 'pendente';
}

export default TracoReflexaoStatus;
