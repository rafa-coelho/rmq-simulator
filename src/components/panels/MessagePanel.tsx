import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Plus, X, MessageSquare } from 'lucide-react';
import { useSimulatorStore } from '../../store/simulatorStore';
import { useAnalytics } from '../../services/analytics';
import type { ProducerNode, ExchangeNode } from '../../types';

export function MessagePanel() {
  const { t } = useTranslation();
  const { nodes, connections, sendMessage, messages, selectedNodeId } = useSimulatorStore();
  const { trackMessageSent } = useAnalytics();

  const [selectedProducerId, setSelectedProducerId] = useState<string>('');

  // Auto-select producer when a producer node is clicked
  useEffect(() => {
    if (selectedNodeId) {
      const selectedNode = nodes.find(n => n.id === selectedNodeId);
      if (selectedNode?.type === 'producer') {
        setSelectedProducerId(selectedNodeId);
      }
    }
  }, [selectedNodeId, nodes]);
  const [content, setContent] = useState('Hello, RabbitMQ!');
  const [routingKey, setRoutingKey] = useState('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [showRoutingKeySuggestions, setShowRoutingKeySuggestions] = useState(false);
  const routingKeyInputRef = useRef<HTMLInputElement>(null);

  const producers = nodes.filter((n): n is ProducerNode => n.type === 'producer');

  // Get all unique routing keys from connections and messages
  const existingRoutingKeys = useMemo(() => {
    const keysFromConnections = connections
      .map(c => c.routingKey)
      .filter((key): key is string => !!key && key.trim() !== '');

    const keysFromMessages = messages
      .map(m => m.routingKey)
      .filter((key): key is string => !!key && key.trim() !== '');

    return [...new Set([...keysFromConnections, ...keysFromMessages])].sort();
  }, [connections, messages]);

  // Filter suggestions based on current input
  const filteredSuggestions = useMemo(() => {
    if (!routingKey.trim()) return existingRoutingKeys;
    return existingRoutingKeys.filter(key =>
      key.toLowerCase().includes(routingKey.toLowerCase())
    );
  }, [routingKey, existingRoutingKeys]);

  const handleRoutingKeySuggestionClick = (key: string) => {
    setRoutingKey(key);
    setShowRoutingKeySuggestions(false);
    routingKeyInputRef.current?.focus();
  };

  const handleSend = () => {
    if (!selectedProducerId || !content) return;

    const headerObj = headers.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    sendMessage(selectedProducerId, content, routingKey, headerObj);

    // Track analytics
    const producerConnection = connections.find(c => c.sourceId === selectedProducerId);
    const exchange = producerConnection
      ? (nodes.find(n => n.id === producerConnection.targetId) as ExchangeNode | undefined)
      : undefined;
    trackMessageSent(exchange?.exchangeType, !!routingKey);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setHeaders(headers.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  const recentMessages = messages.slice(-10).reverse();

  return (
    <div className="bg-rmq-dark border-r border-rmq-light w-80 flex flex-col h-full overflow-hidden">
      {/* Send Message Section */}
      <div className="p-4 border-b border-rmq-light">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Send size={18} />
          {t('messages.send')}
        </h3>

        <div className="space-y-3">
          {/* Producer selection */}
          <div>
            <label className="block text-gray-400 text-xs mb-1">Producer</label>
            <select
              value={selectedProducerId}
              onChange={(e) => setSelectedProducerId(e.target.value)}
              className="input text-sm"
            >
              <option value="">Select a producer...</option>
              {producers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Message content */}
          <div>
            <label className="block text-gray-400 text-xs mb-1">
              {t('messages.content')}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('messages.contentPlaceholder')}
              className="input text-sm h-20 resize-none"
            />
          </div>

          {/* Routing key with suggestions */}
          <div className="relative">
            <label className="block text-gray-400 text-xs mb-1">
              {t('messages.routingKey')}
            </label>
            <input
              ref={routingKeyInputRef}
              type="text"
              value={routingKey}
              onChange={(e) => setRoutingKey(e.target.value)}
              onFocus={() => setShowRoutingKeySuggestions(true)}
              onBlur={() => setTimeout(() => setShowRoutingKeySuggestions(false), 150)}
              placeholder={t('messages.routingKeyPlaceholder')}
              className="input text-sm font-mono"
              autoComplete="off"
            />
            {/* Suggestions dropdown */}
            {showRoutingKeySuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-rmq-darker border border-rmq-light rounded-lg shadow-xl z-50 max-h-32 overflow-y-auto">
                {filteredSuggestions.map((key, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleRoutingKeySuggestionClick(key)}
                    className="w-full px-3 py-1.5 text-left text-sm font-mono text-gray-300 hover:bg-rmq-light/50 hover:text-white transition-colors"
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Headers */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-400 text-xs">{t('messages.headers')}</label>
              <button
                onClick={addHeader}
                className="text-rmq-accent hover:text-white text-xs flex items-center gap-1"
              >
                <Plus size={12} />
                {t('messages.addHeader')}
              </button>
            </div>
            {headers.map((header, index) => (
              <div key={index} className="flex gap-1 mb-1">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="input text-xs flex-1"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="input text-xs flex-1"
                />
                <button
                  onClick={() => removeHeader(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!selectedProducerId || !content}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {t('messages.send')}
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-white font-semibold p-4 pb-2 flex items-center gap-2">
          <MessageSquare size={18} />
          {t('messages.history')}
        </h3>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {recentMessages.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              {t('messages.noMessages')}
            </div>
          ) : (
            <div className="space-y-2">
              {recentMessages.map(msg => (
                <div
                  key={msg.id}
                  className="bg-rmq-darker rounded-lg p-3 border border-rmq-light"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`badge ${
                      msg.status === 'consumed' ? 'badge-green' :
                      msg.status === 'queued' ? 'badge-blue' :
                      msg.status === 'unroutable' ? 'bg-red-500/20 text-red-400' :
                      'badge-orange'
                    }`}>
                      {t(`messages.status.${msg.status}`)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-white text-sm truncate">{msg.content}</div>
                  {msg.routingKey && (
                    <div className="text-gray-400 text-xs mt-1 font-mono">
                      Key: {msg.routingKey}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
