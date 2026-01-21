import { useRef, useState, useCallback, useEffect } from 'react';
import { useSimulatorStore } from '../../store/simulatorStore';
import { ProducerNodeComponent } from '../nodes/ProducerNode';
import { ExchangeNodeComponent } from '../nodes/ExchangeNode';
import { QueueNodeComponent } from '../nodes/QueueNode';
import { ConsumerNodeComponent } from '../nodes/ConsumerNode';
import { ConnectionLine } from './ConnectionLine';
import { TravelingMessageComponent } from './TravelingMessage';
import type { Position } from '../../types';

interface SimulatorCanvasProps {
  onCanvasClick?: (position: Position) => void;
  canvasOffset: Position;
  setCanvasOffset: (offset: Position) => void;
  scale: number;
  setScale: (scale: number) => void;
}

export function SimulatorCanvas({
  onCanvasClick,
  canvasOffset,
  setCanvasOffset,
  scale,
  setScale,
}: SimulatorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStartScreen, setSelectionStartScreen] = useState<Position>({ x: 0, y: 0 });
  const [selectionEndScreen, setSelectionEndScreen] = useState<Position>({ x: 0, y: 0 });
  const [justFinishedSelecting, setJustFinishedSelecting] = useState(false);

  const {
    nodes,
    connections,
    travelingMessages,
    isConnecting,
    connectingFromId,
    cancelConnecting,
    selectMultipleNodes,
    clearSelection,
  } = useSimulatorStore();

  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

  const getCanvasPosition = useCallback((clientX: number, clientY: number): Position => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - canvasOffset.x) / scale,
      y: (clientY - rect.top - canvasOffset.y) / scale,
    };
  }, [canvasOffset, scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse button only for panning
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      return;
    }

    // Left click on canvas background starts selection box
    if (e.button === 0 && (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-grid'))) {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setIsSelecting(true);
      setSelectionStartScreen({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setSelectionEndScreen({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [canvasOffset, getCanvasPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasPosition(e.clientX, e.clientY);
    setMousePosition(pos);

    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }

    if (isSelecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setSelectionEndScreen({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [getCanvasPosition, isPanning, panStart, isSelecting, setCanvasOffset]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (isSelecting) {
      // Convert screen coordinates (relative to canvas element) to canvas world coordinates
      // Screen position = canvasOffset + (world position * scale)
      // World position = (screen position - canvasOffset) / scale
      const minScreenX = Math.min(selectionStartScreen.x, selectionEndScreen.x);
      const maxScreenX = Math.max(selectionStartScreen.x, selectionEndScreen.x);
      const minScreenY = Math.min(selectionStartScreen.y, selectionEndScreen.y);
      const maxScreenY = Math.max(selectionStartScreen.y, selectionEndScreen.y);

      const startCanvas = {
        x: (minScreenX - canvasOffset.x) / scale,
        y: (minScreenY - canvasOffset.y) / scale,
      };
      const endCanvas = {
        x: (maxScreenX - canvasOffset.x) / scale,
        y: (maxScreenY - canvasOffset.y) / scale,
      };

      // Find nodes within selection box (box intersection)
      const nodeWidth = 160;
      const nodeHeight = 100; // Account for header + content

      // Selection bounds in canvas world coordinates
      const selLeft = Math.min(startCanvas.x, endCanvas.x);
      const selRight = Math.max(startCanvas.x, endCanvas.x);
      const selTop = Math.min(startCanvas.y, endCanvas.y);
      const selBottom = Math.max(startCanvas.y, endCanvas.y);

      const selectedIds = nodes
        .filter(node => {
          const nodeLeft = node.position.x;
          const nodeTop = node.position.y;
          const nodeRight = nodeLeft + nodeWidth;
          const nodeBottom = nodeTop + nodeHeight;

          // Check if rectangles overlap (AABB intersection)
          return (
            nodeLeft < selRight &&
            nodeRight > selLeft &&
            nodeTop < selBottom &&
            nodeBottom > selTop
          );
        })
        .map(node => node.id);

      if (selectedIds.length > 0) {
        selectMultipleNodes(selectedIds);
        setJustFinishedSelecting(true);
        // Reset the flag after a short delay to allow click event to be ignored
        setTimeout(() => setJustFinishedSelecting(false), 0);
      }

      setIsSelecting(false);
    }
  }, [isPanning, isSelecting, selectionStartScreen, selectionEndScreen, nodes, selectMultipleNodes, canvasOffset, scale]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-grid')) {
      if (isConnecting) {
        cancelConnecting();
      } else if (!justFinishedSelecting) {
        // Only clear selection if we didn't just finish a box selection
        clearSelection();
        const pos = getCanvasPosition(e.clientX, e.clientY);
        onCanvasClick?.(pos);
      }
    }
  }, [isConnecting, cancelConnecting, clearSelection, getCanvasPosition, onCanvasClick, justFinishedSelecting]);

  // Use native event listener for wheel to properly prevent browser zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      // Zoom only with Ctrl (Windows) or Meta/Command (Mac)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();

        const rect = canvas.getBoundingClientRect();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(scale * delta, 0.25), 2);

        // Calculate the center of the viewport
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate the world position at center before zoom
        const worldCenterX = (centerX - canvasOffset.x) / scale;
        const worldCenterY = (centerY - canvasOffset.y) / scale;

        // Calculate new offset to keep the center point fixed
        const newOffsetX = centerX - worldCenterX * newScale;
        const newOffsetY = centerY - worldCenterY * newScale;

        setCanvasOffset({ x: newOffsetX, y: newOffsetY });
        setScale(newScale);
      }
    };

    // passive: false is required to allow preventDefault() on wheel events
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [scale, setScale, canvasOffset, setCanvasOffset]);

  // Calculate selection box for rendering (in screen coordinates)
  const selectionBoxScreen = isSelecting ? {
    x: Math.min(selectionStartScreen.x, selectionEndScreen.x),
    y: Math.min(selectionStartScreen.y, selectionEndScreen.y),
    width: Math.abs(selectionEndScreen.x - selectionStartScreen.x),
    height: Math.abs(selectionEndScreen.y - selectionStartScreen.y),
  } : null;

  // Escape key to cancel connecting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isConnecting) {
        cancelConnecting();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnecting, cancelConnecting]);

  const renderNode = useCallback((node: typeof nodes[0]) => {
    switch (node.type) {
      case 'producer':
        return <ProducerNodeComponent key={node.id} node={node} />;
      case 'exchange':
        return <ExchangeNodeComponent key={node.id} node={node} />;
      case 'queue':
        return <QueueNodeComponent key={node.id} node={node} />;
      case 'consumer':
        return <ConsumerNodeComponent key={node.id} node={node} />;
      default:
        return null;
    }
  }, []);

  const connectingFromNode = connectingFromId ? nodes.find(n => n.id === connectingFromId) : null;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-rmq-darker canvas-grid cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Nodes layer - rendered first (below) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {nodes.map(renderNode)}
      </div>

      {/* SVG layer for connections - rendered after (above) */}
      <svg
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4fc3f7" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF6600" />
          </marker>
        </defs>

        {/* Render connections */}
        {connections.map(connection => (
          <ConnectionLine
            key={connection.id}
            connection={connection}
            nodes={nodes}
          />
        ))}

        {/* Connecting line preview */}
        {isConnecting && connectingFromNode && (
          <line
            x1={connectingFromNode.position.x + 80}
            y1={connectingFromNode.position.y + 30}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="#FF6600"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="connection-animated"
          />
        )}

        {/* Traveling messages */}
        {travelingMessages.map(traveling => (
          <TravelingMessageComponent
            key={traveling.id}
            traveling={traveling}
            nodes={nodes}
          />
        ))}

      </svg>

      {/* Selection box - rendered in screen coordinates */}
      {selectionBoxScreen && selectionBoxScreen.width > 5 && selectionBoxScreen.height > 5 && (
        <div
          className="absolute border border-dashed border-rmq-accent bg-rmq-accent/10 pointer-events-none"
          style={{
            left: selectionBoxScreen.x,
            top: selectionBoxScreen.y,
            width: selectionBoxScreen.width,
            height: selectionBoxScreen.height,
            zIndex: 100,
          }}
        />
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-rmq-dark/80 px-3 py-1 rounded-lg text-sm text-gray-400">
        {Math.round(scale * 100)}%
      </div>

      {/* Connecting mode indicator */}
      {isConnecting && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rmq-orange/90 px-4 py-2 rounded-lg text-white text-sm font-medium">
          Click on a node to connect • Press ESC to cancel
        </div>
      )}
    </div>
  );
}
