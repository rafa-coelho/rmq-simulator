import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ConsumerNode } from '../../types';

interface ConsumerNodeProps {
  node: ConsumerNode;
}

export function ConsumerNodeComponent({ node }: ConsumerNodeProps) {
  const { t } = useTranslation();

  return (
    <BaseNode
      node={node}
      icon={<User size={16} />}
      color="#4CAF50"
      glowClass="node-glow-green"
      badgeText={node.isProcessing ? '...' : undefined}
      badgeClass="badge-orange"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-400">
          {node.isProcessing
            ? t('nodes.consumer.processing')
            : node.consumedCount > 0
            ? `${node.consumedCount} ${t('nodes.consumer.consumed')}`
            : t('nodes.consumer.idle')}
        </span>
      </div>

      <div className="mt-1 flex gap-2 text-xs">
        {node.autoAck && (
          <span className="text-green-400" title={t('nodes.consumer.autoAck')}>
            Auto
          </span>
        )}
        <span className="text-gray-500">
          {t('nodes.consumer.prefetch')}: {node.prefetchCount}
        </span>
      </div>

      {/* Processing indicator */}
      {node.isProcessing && (
        <div className="mt-2 h-1 bg-rmq-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-rmq-success animate-pulse"
            style={{ width: '100%' }}
          />
        </div>
      )}
    </BaseNode>
  );
}
