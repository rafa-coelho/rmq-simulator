import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { ConfigBadge } from '../common/ConfigBadge';
import type { QueueNode } from '../../types';

interface QueueNodeProps {
  node: QueueNode;
}

export function QueueNodeComponent({ node }: QueueNodeProps) {
  const { t } = useTranslation();

  const messageCount = node.messages.length;
  const inFlightCount = node.messages.filter(m => m.inFlight).length;
  const availableCount = messageCount - inFlightCount;
  const hasHeaders = node.messages.some(msg => Object.keys(msg.headers || {}).length > 0);

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
            : inFlightCount > 0
            ? `${availableCount} ${t('nodes.queue.messages')} + ${inFlightCount} in-flight`
            : `${messageCount} ${t('nodes.queue.messages')}`}
        </span>
        <div className="flex gap-1">
          {node.durable && (
            <ConfigBadge
              label="D"
              color="text-blue-400 bg-blue-500/20"
              titleKey="nodes.queue.config.durable.title"
              descriptionKey="nodes.queue.config.durable.description"
            />
          )}
          {node.autoDelete && (
            <ConfigBadge
              label="AD"
              color="text-yellow-400 bg-yellow-500/20"
              titleKey="nodes.queue.config.autoDelete.title"
              descriptionKey="nodes.queue.config.autoDelete.description"
            />
          )}
          {hasHeaders && (
            <span className="text-xs text-orange-400 px-1.5 py-0.5 rounded bg-orange-500/20" title={t('properties.hasHeaders')}>
              H
            </span>
          )}
        </div>
      </div>

      {/* Message preview bar */}
      {messageCount > 0 && (
        <div className="mt-2 space-y-1">
          {/* Available messages */}
          <div className="h-1 bg-rmq-darker rounded-full overflow-hidden">
            <div
              className="h-full bg-rmq-accent transition-all duration-300"
              style={{ width: `${Math.min(availableCount * 10, 100)}%` }}
            />
          </div>
          {/* In-flight messages (Manual-ACK) */}
          {inFlightCount > 0 && (
            <div className="h-1 bg-rmq-darker rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 animate-pulse transition-all duration-300"
                style={{ width: `${Math.min(inFlightCount * 10, 100)}%` }}
                title={t('nodes.queue.inFlightTooltip') || 'Waiting for ACK'}
              />
            </div>
          )}
        </div>
      )}
    </BaseNode>
  );
}
