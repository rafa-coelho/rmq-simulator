import type { ExampleConfig } from '../types';

export const examples: ExampleConfig[] = [
  {
    id: 'simpleQueue',
    titleKey: 'examples.simpleQueue.title',
    descriptionKey: 'examples.simpleQueue.description',
    nodes: [
      {
        type: 'producer',
        name: 'Producer',
        position: { x: 50, y: 150 },
      },
      {
        type: 'exchange',
        name: 'default',
        position: { x: 300, y: 150 },
        exchangeType: 'direct',
        durable: true,
        autoDelete: false,
      },
      {
        type: 'queue',
        name: 'task_queue',
        position: { x: 550, y: 150 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'consumer',
        name: 'Worker',
        position: { x: 800, y: 150 },
        autoAck: true,
        prefetchCount: 1,
        processingTime: 1000,
        consumedCount: 0,
        isProcessing: false,
      },
    ],
    connections: [
      { sourceId: '0', targetId: '1', routingKey: '' },
      { sourceId: '1', targetId: '2', routingKey: 'task_queue' },
      { sourceId: '2', targetId: '3', routingKey: '' },
    ],
  },
  {
    id: 'workQueues',
    titleKey: 'examples.workQueues.title',
    descriptionKey: 'examples.workQueues.description',
    nodes: [
      {
        type: 'producer',
        name: 'Task Producer',
        position: { x: 50, y: 200 },
      },
      {
        type: 'exchange',
        name: 'tasks',
        position: { x: 300, y: 200 },
        exchangeType: 'direct',
        durable: true,
        autoDelete: false,
      },
      {
        type: 'queue',
        name: 'task_queue',
        position: { x: 550, y: 200 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'consumer',
        name: 'Worker 1',
        position: { x: 800, y: 100 },
        autoAck: false,
        prefetchCount: 1,
        processingTime: 2000,
        consumedCount: 0,
        isProcessing: false,
      },
      {
        type: 'consumer',
        name: 'Worker 2',
        position: { x: 800, y: 300 },
        autoAck: false,
        prefetchCount: 1,
        processingTime: 1500,
        consumedCount: 0,
        isProcessing: false,
      },
    ],
    connections: [
      { sourceId: '0', targetId: '1', routingKey: '' },
      { sourceId: '1', targetId: '2', routingKey: 'task' },
      { sourceId: '2', targetId: '3', routingKey: '' },
      { sourceId: '2', targetId: '4', routingKey: '' },
    ],
  },
  {
    id: 'pubSub',
    titleKey: 'examples.pubSub.title',
    descriptionKey: 'examples.pubSub.description',
    nodes: [
      {
        type: 'producer',
        name: 'Publisher',
        position: { x: 50, y: 200 },
      },
      {
        type: 'exchange',
        name: 'logs',
        position: { x: 300, y: 200 },
        exchangeType: 'fanout',
        durable: false,
        autoDelete: false,
      },
      {
        type: 'queue',
        name: 'queue_1',
        position: { x: 550, y: 100 },
        durable: false,
        autoDelete: true,
        messages: [],
      },
      {
        type: 'queue',
        name: 'queue_2',
        position: { x: 550, y: 300 },
        durable: false,
        autoDelete: true,
        messages: [],
      },
      {
        type: 'consumer',
        name: 'Subscriber 1',
        position: { x: 800, y: 100 },
        autoAck: true,
        prefetchCount: 1,
        processingTime: 500,
        consumedCount: 0,
        isProcessing: false,
      },
      {
        type: 'consumer',
        name: 'Subscriber 2',
        position: { x: 800, y: 300 },
        autoAck: true,
        prefetchCount: 1,
        processingTime: 500,
        consumedCount: 0,
        isProcessing: false,
      },
    ],
    connections: [
      { sourceId: '0', targetId: '1', routingKey: '' },
      { sourceId: '1', targetId: '2', routingKey: '' },
      { sourceId: '1', targetId: '3', routingKey: '' },
      { sourceId: '2', targetId: '4', routingKey: '' },
      { sourceId: '3', targetId: '5', routingKey: '' },
    ],
  },
  {
    id: 'routing',
    titleKey: 'examples.routing.title',
    descriptionKey: 'examples.routing.description',
    nodes: [
      {
        type: 'producer',
        name: 'Logger',
        position: { x: 50, y: 200 },
      },
      {
        type: 'exchange',
        name: 'direct_logs',
        position: { x: 300, y: 200 },
        exchangeType: 'direct',
        durable: true,
        autoDelete: false,
      },
      {
        type: 'queue',
        name: 'error_queue',
        position: { x: 550, y: 100 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'queue',
        name: 'info_queue',
        position: { x: 550, y: 300 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'consumer',
        name: 'Error Handler',
        position: { x: 800, y: 100 },
        autoAck: false,
        prefetchCount: 1,
        processingTime: 1000,
        consumedCount: 0,
        isProcessing: false,
      },
      {
        type: 'consumer',
        name: 'Info Logger',
        position: { x: 800, y: 300 },
        autoAck: true,
        prefetchCount: 10,
        processingTime: 200,
        consumedCount: 0,
        isProcessing: false,
      },
    ],
    connections: [
      { sourceId: '0', targetId: '1', routingKey: '' },
      { sourceId: '1', targetId: '2', routingKey: 'error' },
      { sourceId: '1', targetId: '3', routingKey: 'info' },
      { sourceId: '2', targetId: '4', routingKey: '' },
      { sourceId: '3', targetId: '5', routingKey: '' },
    ],
  },
  {
    id: 'topics',
    titleKey: 'examples.topics.title',
    descriptionKey: 'examples.topics.description',
    nodes: [
      {
        type: 'producer',
        name: 'Event Emitter',
        position: { x: 50, y: 200 },
      },
      {
        type: 'exchange',
        name: 'topic_events',
        position: { x: 300, y: 200 },
        exchangeType: 'topic',
        durable: true,
        autoDelete: false,
      },
      {
        type: 'queue',
        name: 'all_orders',
        position: { x: 550, y: 50 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'queue',
        name: 'us_events',
        position: { x: 550, y: 200 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'queue',
        name: 'critical',
        position: { x: 550, y: 350 },
        durable: true,
        autoDelete: false,
        messages: [],
      },
      {
        type: 'consumer',
        name: 'Order Service',
        position: { x: 800, y: 50 },
        autoAck: true,
        prefetchCount: 1,
        processingTime: 500,
        consumedCount: 0,
        isProcessing: false,
      },
      {
        type: 'consumer',
        name: 'US Service',
        position: { x: 800, y: 200 },
        autoAck: true,
        prefetchCount: 1,
        processingTime: 500,
        consumedCount: 0,
        isProcessing: false,
      },
      {
        type: 'consumer',
        name: 'Alert Service',
        position: { x: 800, y: 350 },
        autoAck: false,
        prefetchCount: 1,
        processingTime: 100,
        consumedCount: 0,
        isProcessing: false,
      },
    ],
    connections: [
      { sourceId: '0', targetId: '1', routingKey: '' },
      { sourceId: '1', targetId: '2', routingKey: '*.order.*' },
      { sourceId: '1', targetId: '3', routingKey: 'us.#' },
      { sourceId: '1', targetId: '4', routingKey: '#.critical' },
      { sourceId: '2', targetId: '5', routingKey: '' },
      { sourceId: '3', targetId: '6', routingKey: '' },
      { sourceId: '4', targetId: '7', routingKey: '' },
    ],
  },
];

export function loadExample(exampleId: string) {
  const example = examples.find(e => e.id === exampleId);
  if (!example) return null;

  const nodeIdMap = new Map<number, string>();

  const nodes = example.nodes.map((node, index) => {
    const id = `${exampleId}-${index}`;
    nodeIdMap.set(index, id);
    return { ...node, id };
  });

  const connections = example.connections.map((conn, index) => {
    const sourceIndex = parseInt(conn.sourceId);
    const targetIndex = parseInt(conn.targetId);
    return {
      ...conn,
      id: `${exampleId}-conn-${index}`,
      sourceId: nodeIdMap.get(sourceIndex) || conn.sourceId,
      targetId: nodeIdMap.get(targetIndex) || conn.targetId,
    };
  });

  return { nodes, connections };
}
