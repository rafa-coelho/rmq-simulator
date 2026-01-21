import { useTranslation } from 'react-i18next';
import { Settings, Trash2, X } from 'lucide-react';
import { useSimulatorStore } from '../../store/simulatorStore';
import type { ExchangeNode, QueueNode, ConsumerNode, ExchangeType } from '../../types';

export function PropertiesPanel() {
  const { t } = useTranslation();
  const {
    selectedNodeId,
    selectedConnectionId,
    selectedNodeIds,
    nodes,
    connections,
    updateNode,
    deleteNode,
    updateConnection,
    deleteConnection,
    selectNode,
    selectConnection,
  } = useSimulatorStore();

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedConnection = selectedConnectionId
    ? connections.find(c => c.id === selectedConnectionId)
    : null;

  // Only show panel when exactly one node is selected OR one connection is selected
  const hasMultipleSelection = selectedNodeIds.length > 1;
  const hasSingleNodeSelection = selectedNodeIds.length === 1 && selectedNode;
  const hasSingleConnectionSelection = selectedConnection && selectedNodeIds.length === 0;
  const shouldShow = (hasSingleNodeSelection || hasSingleConnectionSelection) && !hasMultipleSelection;

  // Connection panel
  if (hasSingleConnectionSelection && selectedConnection) {
    const sourceNode = nodes.find(n => n.id === selectedConnection.sourceId);
    const targetNode = nodes.find(n => n.id === selectedConnection.targetId);
    const isExchangeToQueue = sourceNode?.type === 'exchange' && targetNode?.type === 'queue';

    return (
      <div
        className={`bg-rmq-dark border-r border-rmq-light w-64 p-4 transition-all duration-300 ease-in-out ${
          shouldShow ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Settings size={18} />
            {t('binding.title')}
          </h3>
          <button
            onClick={() => selectConnection(null)}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">From</label>
            <div className="text-white text-sm">{sourceNode?.name || 'Unknown'}</div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">To</label>
            <div className="text-white text-sm">{targetNode?.name || 'Unknown'}</div>
          </div>

          {isExchangeToQueue && (
            <div>
              <label className="block text-gray-400 text-xs mb-1">
                {t('binding.routingKey')}
              </label>
              <input
                type="text"
                value={selectedConnection.routingKey}
                onChange={(e) => updateConnection(selectedConnection.id, { routingKey: e.target.value })}
                placeholder={t('binding.routingKeyPlaceholder')}
                className="input text-sm font-mono"
              />
              <div className="text-gray-500 text-xs mt-1">
                {t('binding.patternHelp')}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              deleteConnection(selectedConnection.id);
            }}
            className="btn w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/20 border border-red-500/30"
          >
            <Trash2 size={16} />
            {t('properties.delete')}
          </button>
        </div>
      </div>
    );
  }

  // Node panel - only show when exactly one node is selected
  if (!hasSingleNodeSelection || !selectedNode) {
    return null;
  }

  return (
    <div
      className={`bg-rmq-dark border-r border-rmq-light w-64 p-4 transition-all duration-300 ease-in-out ${
        shouldShow ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Settings size={18} />
          {t('properties.title')}
        </h3>
        <button
          onClick={() => selectNode(null)}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-400 text-xs mb-1">
            {t('properties.name')}
          </label>
          <input
            type="text"
            value={selectedNode.name}
            onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
            className="input text-sm"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-400 text-xs mb-1">
            {t('properties.type')}
          </label>
          <div className="text-white text-sm capitalize">{selectedNode.type}</div>
        </div>

        {/* Exchange-specific */}
        {selectedNode.type === 'exchange' && (
          <div>
            <label className="block text-gray-400 text-xs mb-1">Exchange Type</label>
            <select
              value={(selectedNode as ExchangeNode).exchangeType}
              onChange={(e) => updateNode(selectedNode.id, {
                exchangeType: e.target.value as ExchangeType
              })}
              className="input text-sm"
            >
              <option value="direct">{t('nodes.exchange.types.direct')}</option>
              <option value="fanout">{t('nodes.exchange.types.fanout')}</option>
              <option value="topic">{t('nodes.exchange.types.topic')}</option>
              <option value="headers">{t('nodes.exchange.types.headers')}</option>
            </select>
          </div>
        )}

        {/* Queue-specific */}
        {selectedNode.type === 'queue' && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="durable"
                checked={(selectedNode as QueueNode).durable}
                onChange={(e) => updateNode(selectedNode.id, { durable: e.target.checked })}
                className="w-4 h-4 rounded border-rmq-light bg-rmq-darker"
              />
              <label htmlFor="durable" className="text-white text-sm">
                {t('nodes.queue.durable')}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoDelete"
                checked={(selectedNode as QueueNode).autoDelete}
                onChange={(e) => updateNode(selectedNode.id, { autoDelete: e.target.checked })}
                className="w-4 h-4 rounded border-rmq-light bg-rmq-darker"
              />
              <label htmlFor="autoDelete" className="text-white text-sm">
                {t('nodes.queue.autoDelete')}
              </label>
            </div>
          </>
        )}

        {/* Consumer-specific */}
        {selectedNode.type === 'consumer' && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoAck"
                checked={(selectedNode as ConsumerNode).autoAck}
                onChange={(e) => updateNode(selectedNode.id, { autoAck: e.target.checked })}
                className="w-4 h-4 rounded border-rmq-light bg-rmq-darker"
              />
              <label htmlFor="autoAck" className="text-white text-sm">
                {t('nodes.consumer.autoAck')}
              </label>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">
                {t('nodes.consumer.prefetch')}
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={(selectedNode as ConsumerNode).prefetchCount}
                onChange={(e) => updateNode(selectedNode.id, {
                  prefetchCount: parseInt(e.target.value) || 1
                })}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">
                Processing Time (ms)
              </label>
              <input
                type="number"
                min={100}
                max={10000}
                step={100}
                value={(selectedNode as ConsumerNode).processingTime}
                onChange={(e) => updateNode(selectedNode.id, {
                  processingTime: parseInt(e.target.value) || 1000
                })}
                className="input text-sm"
              />
            </div>
          </>
        )}

        {/* Delete button */}
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="btn w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/20 border border-red-500/30"
        >
          <Trash2 size={16} />
          {t('properties.delete')}
        </button>
      </div>
    </div>
  );
}
