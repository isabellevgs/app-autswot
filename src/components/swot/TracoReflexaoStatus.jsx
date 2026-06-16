import { Check, Hourglass } from 'lucide-react';
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
};

function TracoReflexaoStatus({ status, className = '' }) {
  if (!status || !CONFIG[status]) return null;

  const { Icon, label, className: iconClass } = CONFIG[status];

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
  if (!item || !statusPorTraco) return null;
  return statusPorTraco[chaveReflexaoTraco(item)] ?? null;
}

export default TracoReflexaoStatus;
