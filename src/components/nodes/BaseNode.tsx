import React, { useCallback, useRef, useState } from 'react';
import { useSimulatorStore } from '../../store/simulatorStore';
import { ContextMenu } from '../canvas/ContextMenu';
import type { SimulatorNode, Position } from '../../types';

interface BaseNodeProps {
  node: SimulatorNode;
  icon: React.ReactNode;
  color: string;
  glowClass: string;
  badgeText?: string;
  badgeClass?: string;
  children?: React.ReactNode;
}

export function BaseNode({
  node,
  icon,
  color,
  glowClass,
  badgeText,
  badgeClass,
  children,
}: BaseNodeProps) {
  const {
    selectedNodeId,
    selectedNodeIds,
    selectNode,
    addToSelection,
    moveNode,
    moveSelectedNodes,
    isConnecting,
    startConnecting,
    finishConnecting,
  } = useSimulatorStore();

  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [nodeStartPos, setNodeStartPos] = useState<Position>({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const isSelected = selectedNodeId === node.id || selectedNodeIds.includes(node.id);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    if (isConnecting) {
      finishConnecting(node.id);
      return;
    }

    // If Ctrl/Cmd is held, add to selection; otherwise select this node
    // But if this node is already selected (part of multi-selection), don't change selection
    if (e.ctrlKey || e.metaKey) {
      addToSelection(node.id);
    } else if (!isSelected) {
      selectNode(node.id);
    }

    // Store the initial mouse position and node position
    setDragStart({ x: e.clientX, y: e.clientY });
    setNodeStartPos({ x: node.position.x, y: node.position.y });
    lastDragPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }, [isConnecting, finishConnecting, selectNode, addToSelection, node.id, node.position, isSelected]);

  const lastDragPos = useRef<Position>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !nodeRef.current) return;

    const parent = nodeRef.current.parentElement;
    if (!parent) return;

    // Get the current scale from the parent transform
    const transform = window.getComputedStyle(parent).transform;
    let scale = 1;

    if (transform && transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      scale = matrix.a;
    }

    // Calculate the delta movement in screen coordinates, then adjust for scale
    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    // Check if we're dragging multiple selected nodes
    const isMultiDrag = selectedNodeIds.length > 1 && selectedNodeIds.includes(node.id);

    if (isMultiDrag) {
      // Calculate incremental delta from last position
      const incrementalDeltaX = (e.clientX - lastDragPos.current.x) / scale;
      const incrementalDeltaY = (e.clientY - lastDragPos.current.y) / scale;

      // Move all selected nodes by the incremental delta
      moveSelectedNodes({ x: incrementalDeltaX, y: incrementalDeltaY });
      lastDragPos.current = { x: e.clientX, y: e.clientY };
    } else {
      // Single node drag - apply delta to the original node position
      const newX = nodeStartPos.x + deltaX;
      const newY = nodeStartPos.y + deltaY;
      moveNode(node.id, { x: newX, y: newY });
    }
  }, [isDragging, dragStart, nodeStartPos, moveNode, moveSelectedNodes, node.id, selectedNodeIds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConnect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    startConnecting(node.id);
  }, [startConnecting, node.id]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <>
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          nodeId={node.id}
          onClose={closeContextMenu}
        />
      )}
    <div
      ref={nodeRef}
      className={`
        absolute w-40 select-none
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{
        left: node.position.x,
        top: node.position.y,
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <div
        className={`
          rounded-xl border-2 overflow-hidden
          ${isSelected ? `border-white ${glowClass}` : 'border-rmq-light/50 node-shadow'}
          transition-shadow duration-200
        `}
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* Header */}
        <div
          className="px-3 py-2 flex items-center gap-2"
          style={{ backgroundColor: color }}
        >
          <div className="text-white">{icon}</div>
          <span className="text-white font-medium text-sm truncate flex-1">
            {node.name}
          </span>
          {badgeText && (
            <span className={`badge ${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-2 text-xs text-gray-300">
          {children}
        </div>

        {/* Connection point */}
        <button
          onClick={handleConnect}
          className={`
            absolute -right-2 top-1/2 -translate-y-1/2
            w-4 h-4 rounded-full
            border-2 border-white
            transition-all duration-200
            hover:scale-125
            ${isConnecting ? 'bg-rmq-orange animate-pulse' : 'bg-rmq-accent'}
          `}
          title="Connect to another node"
        />

        {/* Input connection point */}
        <div
          className={`
            absolute -left-2 top-1/2 -translate-y-1/2
            w-4 h-4 rounded-full
            border-2 border-white bg-rmq-accent
            ${isConnecting ? 'animate-pulse bg-rmq-success' : ''}
          `}
        />
      </div>
    </div>
    </>
  );
}
