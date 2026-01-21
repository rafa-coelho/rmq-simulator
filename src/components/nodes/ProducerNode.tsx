import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ProducerNode } from '../../types';

interface ProducerNodeProps {
  node: ProducerNode;
}

export function ProducerNodeComponent({ node }: ProducerNodeProps) {
  const { t } = useTranslation();

  return (
    <BaseNode
      node={node}
      icon={<Send size={16} />}
      color="#FF6600"
      glowClass="node-glow-orange"
    >
      <div className="text-gray-400">
        {t('nodes.producer.description')}
      </div>
    </BaseNode>
  );
}
