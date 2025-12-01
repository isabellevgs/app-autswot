import { TrendingUp, TrendingDown, Plus, AlertTriangle } from 'lucide-react';

/**
 * Configuração dos módulos SWOT
 */
export const SWOT_MODULOS = {
  ameacas: {
    titulo: 'Ameaças',
    icon: AlertTriangle,
    gradient: 'red',
  },
  fraquezas: {
    titulo: 'Fraquezas',
    icon: TrendingDown,
    gradient: 'orange',
  },
  oportunidades: {
    titulo: 'Oportunidades',
    icon: Plus,
    gradient: 'blue',
  },
  forcas: {
    titulo: 'Forças',
    icon: TrendingUp,
    gradient: 'green',
  }
};

/**
 * Ordem de exibição dos módulos SWOT
 */
export const SWOT_ORDEM = ['ameacas', 'fraquezas', 'oportunidades', 'forcas'];

