// Core types for the RabbitMQ Simulator

export type NodeType = 'producer' | 'exchange' | 'queue' | 'consumer';

export type ExchangeType = 'direct' | 'fanout' | 'topic' | 'headers';

export interface Position {
  x: number;
  y: number;
}

export interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
  position: Position;
}

export interface ProducerNode extends BaseNode {
  type: 'producer';
}

export interface ExchangeNode extends BaseNode {
  type: 'exchange';
  exchangeType: ExchangeType;
  durable: boolean;
  autoDelete: boolean;
}

export interface QueueNode extends BaseNode {
  type: 'queue';
  durable: boolean;
  autoDelete: boolean;
  maxLength?: number;
  messageTtl?: number;
  messages: Message[];
}

export interface ConsumerNode extends BaseNode {
  type: 'consumer';
  autoAck: boolean;
  prefetchCount: number;
  processingTime: number; // ms to process each message
  consumedCount: number;
  isProcessing: boolean;
  currentMessage?: Message; // Message being processed (for Manual-ACK)
  unackedCount: number; // Number of unacked messages (for prefetch)
}

export type SimulatorNode = ProducerNode | ExchangeNode | QueueNode | ConsumerNode;

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  routingKey: string;
  headers?: Record<string, string>;
}

export interface Message {
  id: string;
  content: string;
  routingKey: string;
  headers: Record<string, string>;
  timestamp: number;
  status: MessageStatus;
  path: string[]; // IDs of nodes the message passed through
  inFlight?: boolean; // Message is delivered but not ACKed (Manual-ACK only)
  consumerId?: string; // ID of the consumer processing this message (for in-flight messages)
}

export type MessageStatus =
  | 'created'
  | 'sent'
  | 'routed'
  | 'queued'
  | 'consumed'
  | 'rejected'
  | 'unroutable';

export interface TravelingMessage {
  id: string;
  message: Message;
  fromId: string;
  toId: string;
  progress: number; // 0-100
  connectionId: string;
}

export interface SimulatorState {
  nodes: SimulatorNode[];
  connections: Connection[];
  messages: Message[];
  travelingMessages: TravelingMessage[];
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  isConnecting: boolean;
  connectingFromId: string | null;
  stats: SimulatorStats;
}

export interface SimulatorStats {
  totalSent: number;
  totalRouted: number;
  totalConsumed: number;
  totalRejected: number;
  messagesInQueues: number;
}

export interface DiagramExport {
  version: string;
  nodes: SimulatorNode[];
  connections: Connection[];
  timestamp: number;
}

// Example configurations
export type ExampleNodeConfig =
  | Omit<ProducerNode, 'id'>
  | Omit<ExchangeNode, 'id'>
  | Omit<QueueNode, 'id'>
  | Omit<ConsumerNode, 'id'>;

export interface ExampleConfig {
  id: string;
  titleKey: string;
  descriptionKey: string;
  nodes: ExampleNodeConfig[];
  connections: Omit<Connection, 'id'>[];
}
