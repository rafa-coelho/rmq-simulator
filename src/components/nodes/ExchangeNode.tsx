import { useTranslation } from 'react-i18next';
import { ArrowRightLeft } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ExchangeNode } from '../../types';

interface ExchangeNodeProps {
  node: ExchangeNode;
}

const exchangeColors: Record<string, string> = {
  direct: '#2196F3',
  fanout: '#9C27B0',
  topic: '#4CAF50',
  headers: '#FF9800',
};

export function ExchangeNodeComponent({ node }: ExchangeNodeProps) {
  const { t } = useTranslation();

  const badgeClasses: Record<string, string> = {
    direct: 'badge-blue',
    fanout: 'badge-purple',
    topic: 'badge-green',
    headers: 'badge-orange',
  };

  return (
    <BaseNode
      node={node}
      icon={<ArrowRightLeft size={16} />}
      color={exchangeColors[node.exchangeType]}
      glowClass="node-glow-blue"
      badgeText={t(`nodes.exchange.types.${node.exchangeType}`)}
      badgeClass={badgeClasses[node.exchangeType]}
    >
      <div className="text-gray-400 text-xs">
        {t(`nodes.exchange.typeDescriptions.${node.exchangeType}`)}
      </div>
    </BaseNode>
  );
}
