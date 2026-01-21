import { useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SimulatorCanvas } from '../components/canvas/SimulatorCanvas';
import { FloatingToolbar } from '../components/panels/FloatingToolbar';
import { Toolbar } from '../components/panels/Toolbar';
import { MessagePanel } from '../components/panels/MessagePanel';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';
import { StatsPanel } from '../components/panels/StatsPanel';
import { ShortcutsPanel } from '../components/panels/ShortcutsPanel';
import { useSimulatorStore } from '../store/simulatorStore';
import { useMessageRouter } from '../hooks/useMessageRouter';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { Position } from '../types';

export function HomePage() {
  const { i18n } = useTranslation();
  const { addProducer, addExchange, addQueue, addConsumer } = useSimulatorStore();
  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Initialize message router
  useMessageRouter();

  // Get the center of the current viewport in canvas coordinates
  const getViewportCenter = useCallback((): Position => {
    if (!canvasContainerRef.current) return { x: 200, y: 200 };

    const rect = canvasContainerRef.current.getBoundingClientRect();
    const centerX = (rect.width / 2 - canvasOffset.x) / scale;
    const centerY = (rect.height / 2 - canvasOffset.y) / scale;

    // Offset to center the node (node is 160px wide, ~80px tall)
    return {
      x: centerX - 80,
      y: centerY - 40,
    };
  }, [canvasOffset, scale]);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({ getViewportCenter });

  const handleAddNode = useCallback((type: 'producer' | 'exchange' | 'queue' | 'consumer') => {
    const position = getViewportCenter();
    switch (type) {
      case 'producer':
        addProducer(position);
        break;
      case 'exchange':
        addExchange(position);
        break;
      case 'queue':
        addQueue(position);
        break;
      case 'consumer':
        addConsumer(position);
        break;
    }
  }, [addProducer, addExchange, addQueue, addConsumer, getViewportCenter]);

  // SEO meta tags based on language
  const seoContent = {
    en: {
      title: 'RabbitMQ Simulator - Interactive Visual Message Queue Learning Tool',
      description: 'Learn RabbitMQ concepts with an interactive visual simulator. Create producers, exchanges, queues, and consumers. Watch messages flow in real-time. Free educational tool.',
      keywords: 'RabbitMQ, message queue, AMQP, simulator, learning, tutorial, exchange, queue, producer, consumer, message broker'
    },
    pt: {
      title: 'Simulador RabbitMQ - Ferramenta Visual Interativa para Aprender Filas de Mensagens',
      description: 'Aprenda conceitos de RabbitMQ com um simulador visual interativo. Crie producers, exchanges, filas e consumers. Veja mensagens fluindo em tempo real. Ferramenta educacional gratuita.',
      keywords: 'RabbitMQ, fila de mensagens, AMQP, simulador, aprendizado, tutorial, exchange, fila, producer, consumer, message broker'
    },
    es: {
      title: 'Simulador RabbitMQ - Herramienta Visual Interactiva para Aprender Colas de Mensajes',
      description: 'Aprende conceptos de RabbitMQ con un simulador visual interactivo. Crea producers, exchanges, colas y consumers. Observa mensajes fluir en tiempo real. Herramienta educativa gratuita.',
      keywords: 'RabbitMQ, cola de mensajes, AMQP, simulador, aprendizaje, tutorial, exchange, cola, producer, consumer, message broker'
    }
  };

  const currentLang = i18n.language as keyof typeof seoContent;
  const seo = seoContent[currentLang] || seoContent.en;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://rmq-simulator.com/" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content="https://rmq-simulator.com/" />
        <html lang={i18n.language} />
      </Helmet>

      <div className="flex flex-col h-[calc(100vh-64px)]">
        <Toolbar onAddNode={handleAddNode} />

        <div className="flex-1 flex overflow-hidden relative">
          {/* Main canvas area */}
          <div className="flex-1 relative" ref={canvasContainerRef}>
            <SimulatorCanvas
              canvasOffset={canvasOffset}
              setCanvasOffset={setCanvasOffset}
              scale={scale}
              setScale={setScale}
            />

            {/* Floating toolbar - left side */}
            <FloatingToolbar onAddNode={handleAddNode} />

            {/* Shortcuts panel - bottom left */}
            <ShortcutsPanel />

            {/* Stats overlay - bottom right */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
              <div className="pointer-events-auto">
                <StatsPanel />
              </div>
            </div>
          </div>

          {/* Left panel - Properties */}
          <PropertiesPanel />

          {/* Right panel - Message sending */}
          <MessagePanel />
        </div>
      </div>
    </>
  );
}
