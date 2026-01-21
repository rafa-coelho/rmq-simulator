import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  SimulatorNode,
  Connection,
  Message,
  TravelingMessage,
  SimulatorStats,
  Position,
  ExchangeType,
  ProducerNode,
  ExchangeNode,
  QueueNode,
  ConsumerNode,
  MessageStatus,
} from '../types';

interface HistoryState {
  nodes: SimulatorNode[];
  connections: Connection[];
}

interface SimulatorStore {
  // State
  nodes: SimulatorNode[];
  connections: Connection[];
  messages: Message[];
  travelingMessages: TravelingMessage[];
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  selectedNodeIds: string[];
  isConnecting: boolean;
  connectingFromId: string | null;
  stats: SimulatorStats;

  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;

  // Node actions
  addProducer: (position: Position, name?: string) => string;
  addExchange: (position: Position, name?: string, exchangeType?: ExchangeType) => string;
  addQueue: (position: Position, name?: string) => string;
  addConsumer: (position: Position, name?: string) => string;
  updateNode: (id: string, updates: Partial<SimulatorNode>) => void;
  deleteNode: (id: string) => void;
  deleteSelectedNodes: () => void;
  moveNode: (id: string, position: Position) => void;
  moveSelectedNodes: (delta: Position) => void;
  duplicateNode: (id: string) => string | null;

  // Connection actions
  startConnecting: (fromId: string) => void;
  finishConnecting: (toId: string) => boolean;
  cancelConnecting: () => void;
  addConnection: (sourceId: string, targetId: string, routingKey?: string) => string | null;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;

  // Selection actions
  selectNode: (id: string | null) => void;
  selectConnection: (id: string | null) => void;
  selectMultipleNodes: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;

  // Message actions
  sendMessage: (producerId: string, content: string, routingKey: string, headers?: Record<string, string>) => void;
  addMessageToQueue: (queueId: string, message: Message) => void;
  consumeMessage: (consumerId: string) => void;
  addTravelingMessage: (message: TravelingMessage) => void;
  removeTravelingMessage: (id: string) => void;
  updateTravelingMessage: (id: string, updates: Partial<TravelingMessage>) => void;

  // Utility actions
  clearCanvas: () => void;
  loadDiagram: (nodes: SimulatorNode[], connections: Connection[]) => void;
  getNode: (id: string) => SimulatorNode | undefined;
  getConnection: (id: string) => Connection | undefined;
  getConnectedNodes: (nodeId: string) => { incoming: SimulatorNode[]; outgoing: SimulatorNode[] };

  // History actions
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Selection helpers
  selectAll: () => void;
  duplicateSelectedNodes: () => void;
}

const initialStats: SimulatorStats = {
  totalSent: 0,
  totalRouted: 0,
  totalConsumed: 0,
  totalRejected: 0,
  messagesInQueues: 0,
};

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  // Initial state
  nodes: [],
  connections: [],
  messages: [],
  travelingMessages: [],
  selectedNodeId: null,
  selectedConnectionId: null,
  selectedNodeIds: [],
  isConnecting: false,
  connectingFromId: null,
  stats: initialStats,

  // History state
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  // Node actions
  addProducer: (position, name) => {
    get().saveToHistory();
    const id = uuidv4();
    const producer: ProducerNode = {
      id,
      type: 'producer',
      name: name || `Producer ${get().nodes.filter(n => n.type === 'producer').length + 1}`,
      position,
    };
    set(state => ({ nodes: [...state.nodes, producer] }));
    return id;
  },

  addExchange: (position, name, exchangeType = 'direct') => {
    get().saveToHistory();
    const id = uuidv4();
    const exchange: ExchangeNode = {
      id,
      type: 'exchange',
      name: name || `Exchange ${get().nodes.filter(n => n.type === 'exchange').length + 1}`,
      position,
      exchangeType,
      durable: true,
      autoDelete: false,
    };
    set(state => ({ nodes: [...state.nodes, exchange] }));
    return id;
  },

  addQueue: (position, name) => {
    get().saveToHistory();
    const id = uuidv4();
    const queue: QueueNode = {
      id,
      type: 'queue',
      name: name || `Queue ${get().nodes.filter(n => n.type === 'queue').length + 1}`,
      position,
      durable: true,
      autoDelete: false,
      messages: [],
    };
    set(state => ({ nodes: [...state.nodes, queue] }));
    return id;
  },

  addConsumer: (position, name) => {
    get().saveToHistory();
    const id = uuidv4();
    const consumer: ConsumerNode = {
      id,
      type: 'consumer',
      name: name || `Consumer ${get().nodes.filter(n => n.type === 'consumer').length + 1}`,
      position,
      autoAck: true,
      prefetchCount: 1,
      processingTime: 1000,
      consumedCount: 0,
      isProcessing: false,
    };
    set(state => ({ nodes: [...state.nodes, consumer] }));
    return id;
  },

  updateNode: (id, updates) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, ...updates } as SimulatorNode : node
      ),
    }));
  },

  deleteNode: (id) => {
    get().saveToHistory();
    set(state => ({
      nodes: state.nodes.filter(node => node.id !== id),
      connections: state.connections.filter(
        conn => conn.sourceId !== id && conn.targetId !== id
      ),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      selectedNodeIds: state.selectedNodeIds.filter(nodeId => nodeId !== id),
    }));
  },

  deleteSelectedNodes: () => {
    const { selectedNodeIds } = get();
    if (selectedNodeIds.length === 0) return;

    get().saveToHistory();
    set(state => ({
      nodes: state.nodes.filter(node => !selectedNodeIds.includes(node.id)),
      connections: state.connections.filter(
        conn => !selectedNodeIds.includes(conn.sourceId) && !selectedNodeIds.includes(conn.targetId)
      ),
      selectedNodeId: null,
      selectedNodeIds: [],
    }));
  },

  moveNode: (id, position) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, position } : node
      ),
    }));
  },

  moveSelectedNodes: (delta) => {
    const { selectedNodeIds } = get();
    if (selectedNodeIds.length === 0) return;

    set(state => ({
      nodes: state.nodes.map(node =>
        selectedNodeIds.includes(node.id)
          ? { ...node, position: { x: node.position.x + delta.x, y: node.position.y + delta.y } }
          : node
      ),
    }));
  },

  duplicateNode: (id) => {
    const { nodes } = get();
    const node = nodes.find(n => n.id === id);
    if (!node) return null;

    get().saveToHistory();

    const newId = uuidv4();
    const newNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: newId,
      name: `${node.name} (copy)`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    };

    set(state => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: newId,
      selectedNodeIds: [newId],
    }));

    return newId;
  },

  // Connection actions
  startConnecting: (fromId) => {
    set({ isConnecting: true, connectingFromId: fromId });
  },

  finishConnecting: (toId) => {
    const { connectingFromId, addConnection } = get();
    if (!connectingFromId || connectingFromId === toId) {
      set({ isConnecting: false, connectingFromId: null });
      return false;
    }

    const connectionId = addConnection(connectingFromId, toId);
    set({ isConnecting: false, connectingFromId: null });
    return connectionId !== null;
  },

  cancelConnecting: () => {
    set({ isConnecting: false, connectingFromId: null });
  },

  addConnection: (sourceId, targetId, routingKey = '') => {
    const { nodes, connections } = get();
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);

    if (!source || !target) return null;

    // Validate connection types
    const validConnections: Record<string, string[]> = {
      producer: ['exchange'],
      exchange: ['queue'],
      queue: ['consumer'],
    };

    if (!validConnections[source.type]?.includes(target.type)) {
      return null;
    }

    // Check if connection already exists
    const exists = connections.some(
      c => c.sourceId === sourceId && c.targetId === targetId
    );
    if (exists) return null;

    get().saveToHistory();

    const id = uuidv4();
    const connection: Connection = {
      id,
      sourceId,
      targetId,
      routingKey,
    };

    set(state => ({ connections: [...state.connections, connection] }));
    return id;
  },

  updateConnection: (id, updates) => {
    set(state => ({
      connections: state.connections.map(conn =>
        conn.id === id ? { ...conn, ...updates } : conn
      ),
    }));
  },

  deleteConnection: (id) => {
    get().saveToHistory();
    set(state => ({
      connections: state.connections.filter(conn => conn.id !== id),
      selectedConnectionId: state.selectedConnectionId === id ? null : state.selectedConnectionId,
    }));
  },

  // Selection actions
  selectNode: (id) => {
    set({ selectedNodeId: id, selectedConnectionId: null, selectedNodeIds: id ? [id] : [] });
  },

  selectConnection: (id) => {
    set({ selectedConnectionId: id, selectedNodeId: null, selectedNodeIds: [] });
  },

  selectMultipleNodes: (ids) => {
    set({ selectedNodeIds: ids, selectedNodeId: ids.length === 1 ? ids[0] : null, selectedConnectionId: null });
  },

  addToSelection: (id) => {
    set(state => ({
      selectedNodeIds: state.selectedNodeIds.includes(id)
        ? state.selectedNodeIds.filter(nodeId => nodeId !== id)
        : [...state.selectedNodeIds, id],
      selectedNodeId: null,
      selectedConnectionId: null,
    }));
  },

  clearSelection: () => {
    set({ selectedNodeId: null, selectedConnectionId: null, selectedNodeIds: [] });
  },

  // Message actions
  sendMessage: (producerId, content, routingKey, headers = {}) => {
    const { nodes, connections } = get();
    const producer = nodes.find(n => n.id === producerId && n.type === 'producer');
    if (!producer) return;

    const message: Message = {
      id: uuidv4(),
      content,
      routingKey,
      headers,
      timestamp: Date.now(),
      status: 'created',
      path: [producerId],
    };

    // Find connected exchange
    const exchangeConnection = connections.find(c => c.sourceId === producerId);
    if (!exchangeConnection) {
      message.status = 'unroutable';
      set(state => ({
        messages: [...state.messages, message],
        stats: { ...state.stats, totalSent: state.stats.totalSent + 1, totalRejected: state.stats.totalRejected + 1 },
      }));
      return;
    }

    message.status = 'sent';
    set(state => ({
      messages: [...state.messages, message],
      stats: { ...state.stats, totalSent: state.stats.totalSent + 1 },
    }));

    // Create traveling message to exchange
    const travelingMessage: TravelingMessage = {
      id: uuidv4(),
      message,
      fromId: producerId,
      toId: exchangeConnection.targetId,
      progress: 0,
      connectionId: exchangeConnection.id,
    };

    get().addTravelingMessage(travelingMessage);
  },

  addMessageToQueue: (queueId, message) => {
    set(state => {
      const updatedNodes = state.nodes.map(node => {
        if (node.id === queueId && node.type === 'queue') {
          const queueNode = node as QueueNode;
          return {
            ...queueNode,
            messages: [...queueNode.messages, { ...message, status: 'queued' as MessageStatus }],
          };
        }
        return node;
      });

      const messagesInQueues = updatedNodes
        .filter((n): n is QueueNode => n.type === 'queue')
        .reduce((sum, q) => sum + q.messages.length, 0);

      return {
        nodes: updatedNodes,
        stats: { ...state.stats, messagesInQueues },
      };
    });
  },

  consumeMessage: (consumerId) => {
    const { nodes, connections } = get();
    const consumer = nodes.find(n => n.id === consumerId) as ConsumerNode | undefined;
    if (!consumer || consumer.isProcessing) return;

    // Find connected queue
    const queueConnection = connections.find(c => c.targetId === consumerId);
    if (!queueConnection) return;

    const queue = nodes.find(n => n.id === queueConnection.sourceId) as QueueNode | undefined;
    if (!queue || queue.messages.length === 0) return;

    const message = queue.messages[0];

    // Remove message from queue and mark consumer as processing
    set(state => {
      const updatedNodes = state.nodes.map(node => {
        if (node.id === queue.id && node.type === 'queue') {
          return { ...node, messages: (node as QueueNode).messages.slice(1) };
        }
        if (node.id === consumerId && node.type === 'consumer') {
          return { ...node, isProcessing: true };
        }
        return node;
      });

      const messagesInQueues = updatedNodes
        .filter((n): n is QueueNode => n.type === 'queue')
        .reduce((sum, q) => sum + q.messages.length, 0);

      return { nodes: updatedNodes, stats: { ...state.stats, messagesInQueues } };
    });

    // Create traveling message from queue to consumer
    const travelingMessage: TravelingMessage = {
      id: uuidv4(),
      message: { ...message, status: 'consumed' },
      fromId: queue.id,
      toId: consumerId,
      progress: 0,
      connectionId: queueConnection.id,
    };

    get().addTravelingMessage(travelingMessage);
  },

  addTravelingMessage: (message) => {
    set(state => ({
      travelingMessages: [...state.travelingMessages, message],
    }));
  },

  removeTravelingMessage: (id) => {
    set(state => ({
      travelingMessages: state.travelingMessages.filter(m => m.id !== id),
    }));
  },

  updateTravelingMessage: (id, updates) => {
    set(state => ({
      travelingMessages: state.travelingMessages.map(m =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  },

  // Utility actions
  clearCanvas: () => {
    set({
      nodes: [],
      connections: [],
      messages: [],
      travelingMessages: [],
      selectedNodeId: null,
      selectedConnectionId: null,
      selectedNodeIds: [],
      stats: initialStats,
    });
  },

  loadDiagram: (nodes, connections) => {
    set({
      nodes,
      connections,
      messages: [],
      travelingMessages: [],
      selectedNodeId: null,
      selectedConnectionId: null,
      selectedNodeIds: [],
      stats: initialStats,
    });
  },

  getNode: (id) => get().nodes.find(n => n.id === id),

  getConnection: (id) => get().connections.find(c => c.id === id),

  getConnectedNodes: (nodeId) => {
    const { nodes, connections } = get();
    const incomingConns = connections.filter(c => c.targetId === nodeId);
    const outgoingConns = connections.filter(c => c.sourceId === nodeId);

    return {
      incoming: incomingConns.map(c => nodes.find(n => n.id === c.sourceId)).filter(Boolean) as SimulatorNode[],
      outgoing: outgoingConns.map(c => nodes.find(n => n.id === c.targetId)).filter(Boolean) as SimulatorNode[],
    };
  },

  // History actions
  saveToHistory: () => {
    const { nodes, connections, history, historyIndex, maxHistorySize } = get();
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      connections: JSON.parse(JSON.stringify(connections)),
    };

    // Remove any future states if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;

    const previousState = history[historyIndex - 1];
    set({
      nodes: JSON.parse(JSON.stringify(previousState.nodes)),
      connections: JSON.parse(JSON.stringify(previousState.connections)),
      historyIndex: historyIndex - 1,
      selectedNodeId: null,
      selectedConnectionId: null,
      selectedNodeIds: [],
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;

    const nextState = history[historyIndex + 1];
    set({
      nodes: JSON.parse(JSON.stringify(nextState.nodes)),
      connections: JSON.parse(JSON.stringify(nextState.connections)),
      historyIndex: historyIndex + 1,
      selectedNodeId: null,
      selectedConnectionId: null,
      selectedNodeIds: [],
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // Selection helpers
  selectAll: () => {
    const { nodes } = get();
    const allIds = nodes.map(n => n.id);
    set({
      selectedNodeIds: allIds,
      selectedNodeId: allIds.length === 1 ? allIds[0] : null,
      selectedConnectionId: null,
    });
  },

  duplicateSelectedNodes: () => {
    const { selectedNodeIds, nodes, connections, saveToHistory } = get();
    if (selectedNodeIds.length === 0) return;

    saveToHistory();

    const idMap = new Map<string, string>();
    const newNodes: SimulatorNode[] = [];

    // Duplicate nodes
    selectedNodeIds.forEach(id => {
      const node = nodes.find(n => n.id === id);
      if (!node) return;

      const newId = uuidv4();
      idMap.set(id, newId);

      const newNode = {
        ...JSON.parse(JSON.stringify(node)),
        id: newId,
        name: `${node.name} (copy)`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };
      newNodes.push(newNode);
    });

    // Duplicate connections between selected nodes
    const newConnections: Connection[] = [];
    connections.forEach(conn => {
      if (idMap.has(conn.sourceId) && idMap.has(conn.targetId)) {
        newConnections.push({
          id: uuidv4(),
          sourceId: idMap.get(conn.sourceId)!,
          targetId: idMap.get(conn.targetId)!,
          routingKey: conn.routingKey,
        });
      }
    });

    set(state => ({
      nodes: [...state.nodes, ...newNodes],
      connections: [...state.connections, ...newConnections],
      selectedNodeIds: newNodes.map(n => n.id),
      selectedNodeId: newNodes.length === 1 ? newNodes[0].id : null,
    }));
  },
}));
