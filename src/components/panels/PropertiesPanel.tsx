import { useTranslation } from 'react-i18next';
import { Settings, Trash2, X, Plus } from 'lucide-react';
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
            <label className="block text-gray-400 text-xs mb-1">{t('properties.from')}</label>
            <div className="text-white text-sm">{sourceNode?.name || 'Unknown'}</div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">{t('properties.to')}</label>
            <div className="text-white text-sm">{targetNode?.name || 'Unknown'}</div>
          </div>

          {isExchangeToQueue && (
            <>
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

              {/* Headers for binding (only for headers exchange) */}
              {sourceNode?.type === 'exchange' && (sourceNode as ExchangeNode).exchangeType === 'headers' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs">{t('messages.headers')}</label>
                    <button
                      onClick={() => {
                        const currentHeaders = selectedConnection.headers || {};
                        const newKey = `header${Object.keys(currentHeaders).length + 1}`;
                        updateConnection(selectedConnection.id, {
                          headers: { ...currentHeaders, [newKey]: '' }
                        });
                      }}
                      className="text-rmq-accent hover:text-white text-xs flex items-center gap-1"
                    >
                      <Plus size={12} />
                      {t('messages.addHeader')}
                    </button>
                  </div>
                  {selectedConnection.headers && Object.entries(selectedConnection.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-1 mb-1">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newHeaders = { ...selectedConnection.headers };
                          delete newHeaders[key];
                          newHeaders[e.target.value] = value;
                          updateConnection(selectedConnection.id, { headers: newHeaders });
                        }}
                        placeholder="Key"
                        className="input text-xs flex-1 font-mono"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          updateConnection(selectedConnection.id, {
                            headers: { ...selectedConnection.headers, [key]: e.target.value }
                          });
                        }}
                        placeholder="Value"
                        className="input text-xs flex-1 font-mono"
                      />
                      <button
                        onClick={() => {
                          const newHeaders = { ...selectedConnection.headers };
                          delete newHeaders[key];
                          updateConnection(selectedConnection.id, { headers: newHeaders });
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="text-gray-500 text-xs mt-1">
                    {t('binding.headersHelp')}
                  </div>
                </div>
              )}
            </>
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
            <label className="block text-gray-400 text-xs mb-1">{t('properties.exchangeType')}</label>
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

            {/* Show messages in queue with headers */}
            {(selectedNode as QueueNode).messages.length > 0 && (
              <div className="mt-4">
                <label className="block text-gray-400 text-xs mb-2">
                  {t('nodes.queue.messages')} ({(selectedNode as QueueNode).messages.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(selectedNode as QueueNode).messages.slice(0, 5).map((msg, idx) => (
                    <div key={idx} className="bg-rmq-darker p-2 rounded border border-rmq-light text-xs">
                      <div className="text-white truncate">{msg.content}</div>
                      {msg.routingKey && (
                        <div className="text-gray-400 font-mono mt-1">Key: {msg.routingKey}</div>
                      )}
                      {msg.headers && Object.keys(msg.headers).length > 0 && (
                        <div className="text-orange-400 font-mono mt-1">
                          Headers: {JSON.stringify(msg.headers)}
                        </div>
                      )}
                    </div>
                  ))}
                  {(selectedNode as QueueNode).messages.length > 5 && (
                    <div className="text-gray-500 text-xs text-center">
                      +{(selectedNode as QueueNode).messages.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
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
                {t('properties.processingTime')}
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
