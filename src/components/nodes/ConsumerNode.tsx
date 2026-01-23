import { useTranslation } from 'react-i18next';
import { User, Check } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { ConfigBadge } from '../common/ConfigBadge';
import { useSimulatorStore } from '../../store/simulatorStore';
import type { ConsumerNode } from '../../types';

interface ConsumerNodeProps {
  node: ConsumerNode;
}

export function ConsumerNodeComponent({ node }: ConsumerNodeProps) {
  const { t } = useTranslation();
  const { acknowledgeMessage } = useSimulatorStore();

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

      <div className="mt-1 flex gap-1 text-xs flex-wrap items-center">
        {node.autoAck ? (
          <ConfigBadge
            label="Auto-ACK"
            color="text-yellow-400 bg-yellow-500/20"
            titleKey="nodes.consumer.config.autoAck.title"
            descriptionKey="nodes.consumer.config.autoAck.description"
            icon="⚡"
          />
        ) : (
          <ConfigBadge
            label="Manual-ACK"
            color="text-green-400 bg-green-500/20"
            titleKey="nodes.consumer.config.manualAck.title"
            descriptionKey="nodes.consumer.config.manualAck.description"
            icon="✓"
          />
        )}
        <ConfigBadge
          label={`Prefetch: ${node.prefetchCount}`}
          color="text-gray-400 bg-gray-500/20"
          titleKey="nodes.consumer.config.prefetch.title"
          descriptionKey="nodes.consumer.config.prefetch.description"
        />
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

      {/* Manual ACK button */}
      {!node.autoAck && node.currentMessage && !node.isProcessing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            acknowledgeMessage(node.id);
          }}
          className="mt-2 w-full px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-400 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
          title={t('nodes.consumer.ackButton') || 'Click to ACK message'}
        >
          <Check size={12} />
          {t('nodes.consumer.ackButton') || 'ACK Message'}
        </button>
      )}
    </BaseNode>
  );
}
