import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { QueueNode } from '../../types';

interface QueueNodeProps {
  node: QueueNode;
}

export function QueueNodeComponent({ node }: QueueNodeProps) {
  const { t } = useTranslation();

  const messageCount = node.messages.length;

  return (
    <BaseNode
      node={node}
      icon={<Inbox size={16} />}
      color="#4fc3f7"
      glowClass="node-glow-blue"
      badgeText={messageCount > 0 ? String(messageCount) : undefined}
      badgeClass="badge-blue"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-400">
          {messageCount === 0
            ? t('nodes.queue.empty')
            : `${messageCount} ${t('nodes.queue.messages')}`}
        </span>
        <div className="flex gap-1">
          {node.durable && (
            <span className="text-xs text-blue-400" title={t('nodes.queue.durable')}>
              D
            </span>
          )}
          {node.autoDelete && (
            <span className="text-xs text-yellow-400" title={t('nodes.queue.autoDelete')}>
              AD
            </span>
          )}
        </div>
      </div>

      {/* Message preview bar */}
      {messageCount > 0 && (
        <div className="mt-2 h-1 bg-rmq-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-rmq-accent transition-all duration-300"
            style={{ width: `${Math.min(messageCount * 10, 100)}%` }}
          />
        </div>
      )}
    </BaseNode>
  );
}
