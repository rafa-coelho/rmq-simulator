import { useCallback, useEffect, useRef } from 'react';
import { useSimulatorStore } from '../store/simulatorStore';
import type { ExchangeNode, QueueNode, ConsumerNode, TravelingMessage, Message } from '../types';

// Matching function for topic patterns
function matchTopicPattern(routingKey: string, pattern: string): boolean {
  const routingParts = routingKey.split('.');
  const patternParts = pattern.split('.');

  let ri = 0;
  let pi = 0;

  while (pi < patternParts.length) {
    const patternPart = patternParts[pi];

    if (patternPart === '#') {
      // # matches zero or more words
      if (pi === patternParts.length - 1) {
        // # at the end matches everything
        return true;
      }
      // Find the next non-# pattern part
      const nextPatternPart = patternParts[pi + 1];
      while (ri < routingParts.length) {
        if (routingParts[ri] === nextPatternPart || nextPatternPart === '*') {
          break;
        }
        ri++;
      }
      pi++;
    } else if (patternPart === '*') {
      // * matches exactly one word
      if (ri >= routingParts.length) {
        return false;
      }
      ri++;
      pi++;
    } else {
      // Exact match required
      if (ri >= routingParts.length || routingParts[ri] !== patternPart) {
        return false;
      }
      ri++;
      pi++;
    }
  }

  return ri === routingParts.length;
}

export function useMessageRouter() {
  const {
    nodes,
    connections,
    travelingMessages,
    removeTravelingMessage,
    updateTravelingMessage,
    addMessageToQueue,
    addTravelingMessage,
    updateNode,
  } = useSimulatorStore();

  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  const routeMessageThroughExchange = useCallback((
    message: Message,
    exchange: ExchangeNode
  ): { queueId: string; connectionId: string }[] => {
    const exchangeConnections = connections.filter(c => c.sourceId === exchange.id);
    const results: { queueId: string; connectionId: string }[] = [];

    for (const conn of exchangeConnections) {
      const targetQueue = nodes.find(n => n.id === conn.targetId && n.type === 'queue');
      if (!targetQueue) continue;

      let shouldRoute = false;

      switch (exchange.exchangeType) {
        case 'fanout':
          // Fanout always routes to all bound queues
          shouldRoute = true;
          break;
        case 'direct':
          // Direct requires exact routing key match
          shouldRoute = message.routingKey === conn.routingKey;
          break;
        case 'topic':
          // Topic uses pattern matching
          shouldRoute = matchTopicPattern(message.routingKey, conn.routingKey);
          break;
        case 'headers':
          // Headers matching (simplified - checks if all binding headers exist in message)
          if (conn.headers && Object.keys(conn.headers).length > 0) {
            shouldRoute = Object.entries(conn.headers).every(
              ([key, value]) => message.headers[key] === value
            );
          }
          break;
      }

      if (shouldRoute) {
        results.push({ queueId: targetQueue.id, connectionId: conn.id });
      }
    }

    return results;
  }, [connections, nodes]);

  const processArrivedMessage = useCallback((traveling: TravelingMessage) => {
    const targetNode = nodes.find(n => n.id === traveling.toId);
    if (!targetNode) return;

    if (targetNode.type === 'exchange') {
      // Route through exchange
      const exchange = targetNode as ExchangeNode;
      const routes = routeMessageThroughExchange(traveling.message, exchange);

      if (routes.length === 0) {
        // Message is unroutable
        useSimulatorStore.setState(state => ({
          messages: state.messages.map(m =>
            m.id === traveling.message.id
              ? { ...m, status: 'unroutable' as const }
              : m
          ),
          stats: { ...state.stats, totalRejected: state.stats.totalRejected + 1 },
        }));
        return;
      }

      // Create traveling messages to each matched queue
      for (const route of routes) {
        const newTraveling: TravelingMessage = {
          id: `${traveling.id}-${route.queueId}`,
          message: {
            ...traveling.message,
            status: 'routed',
            path: [...traveling.message.path, exchange.id],
          },
          fromId: exchange.id,
          toId: route.queueId,
          progress: 0,
          connectionId: route.connectionId,
        };
        addTravelingMessage(newTraveling);
      }

      useSimulatorStore.setState(state => ({
        stats: { ...state.stats, totalRouted: state.stats.totalRouted + routes.length },
      }));
    } else if (targetNode.type === 'queue') {
      // Add message to queue
      const updatedMessage = {
        ...traveling.message,
        path: [...traveling.message.path, targetNode.id],
      };
      addMessageToQueue(targetNode.id, updatedMessage);
    } else if (targetNode.type === 'consumer') {
      // Message consumed
      const consumer = targetNode as ConsumerNode;

      // Simulate processing time
      setTimeout(() => {
        updateNode(consumer.id, {
          isProcessing: false,
          consumedCount: consumer.consumedCount + 1,
        } as Partial<ConsumerNode>);

        useSimulatorStore.setState(state => ({
          stats: { ...state.stats, totalConsumed: state.stats.totalConsumed + 1 },
        }));

        // Auto-ACK automatically acknowledges the message
        if (consumer.autoAck) {
          // Message already removed from queue in consumeMessage
          // Nothing else to do
        } else {
          // Manual-ACK: Message is still in-flight, waiting for user to ACK
          // Auto-acknowledge after processing for demo purposes
          setTimeout(() => {
            useSimulatorStore.getState().acknowledgeMessage(consumer.id);
          }, 500);
        }
      }, consumer.processingTime);
    }
  }, [nodes, routeMessageThroughExchange, addMessageToQueue, addTravelingMessage, updateNode]);

  // Animation loop for traveling messages
  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const travelSpeed = 0.1; // progress per ms

      travelingMessages.forEach(traveling => {
        const newProgress = traveling.progress + deltaTime * travelSpeed;

        if (newProgress >= 100) {
          // Message arrived
          removeTravelingMessage(traveling.id);
          processArrivedMessage(traveling);
        } else {
          updateTravelingMessage(traveling.id, { progress: newProgress });
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [travelingMessages, removeTravelingMessage, updateTravelingMessage, processArrivedMessage]);

  // Auto-consume messages from queues
  useEffect(() => {
    const interval = setInterval(() => {
      const queues = nodes.filter((n): n is QueueNode => n.type === 'queue');

      for (const queue of queues) {
        if (queue.messages.length === 0) continue;

        // Find connected consumers
        const consumerConnections = connections.filter(c => c.sourceId === queue.id);

        for (const conn of consumerConnections) {
          const consumer = nodes.find(n => n.id === conn.targetId) as ConsumerNode | undefined;
          if (consumer && !consumer.isProcessing && queue.messages.length > 0) {
            useSimulatorStore.getState().consumeMessage(consumer.id);
            break;
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [nodes, connections]);
}
