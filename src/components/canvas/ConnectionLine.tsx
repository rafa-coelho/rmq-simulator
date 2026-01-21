import { useSimulatorStore } from '../../store/simulatorStore';
import type { Connection, SimulatorNode } from '../../types';

interface ConnectionLineProps {
  connection: Connection;
  nodes: SimulatorNode[];
}

export function ConnectionLine({ connection, nodes }: ConnectionLineProps) {
  const { selectConnection, selectedConnectionId } = useSimulatorStore();

  const sourceNode = nodes.find(n => n.id === connection.sourceId);
  const targetNode = nodes.find(n => n.id === connection.targetId);

  if (!sourceNode || !targetNode) return null;

  // Calculate connection points
  const nodeWidth = 160;
  const nodeHeight = 60;

  const startX = sourceNode.position.x + nodeWidth;
  const startY = sourceNode.position.y + nodeHeight / 2;
  const endX = targetNode.position.x;
  const endY = targetNode.position.y + nodeHeight / 2;

  // Create a curved path
  const midX = (startX + endX) / 2;
  const controlPoint1X = startX + (midX - startX) * 0.5;
  const controlPoint2X = endX - (endX - midX) * 0.5;

  const path = `M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`;

  const isActive = selectedConnectionId === connection.id;

  return (
    <g
      className="cursor-pointer"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        e.stopPropagation();
        selectConnection(connection.id);
      }}
    >
      {/* Invisible wider path for easier clicking */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        style={{ pointerEvents: 'stroke' }}
      />

      {/* Visible path */}
      <path
        d={path}
        fill="none"
        stroke={isActive ? '#FF6600' : '#4fc3f7'}
        strokeWidth={isActive ? 3 : 2}
        markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
        className={isActive ? '' : 'connection-animated'}
        style={{ pointerEvents: 'none' }}
      />

      {/* Routing key label */}
      {connection.routingKey && (
        <g>
          <rect
            x={midX - 40}
            y={(startY + endY) / 2 - 12}
            width={80}
            height={24}
            rx={4}
            fill="#1a1a2e"
            stroke={isActive ? '#FF6600' : '#4fc3f7'}
            strokeWidth={1}
          />
          <text
            x={midX}
            y={(startY + endY) / 2 + 4}
            textAnchor="middle"
            fill={isActive ? '#FF6600' : '#4fc3f7'}
            fontSize={11}
            fontFamily="monospace"
          >
            {connection.routingKey.length > 10
              ? connection.routingKey.substring(0, 10) + '...'
              : connection.routingKey}
          </text>
        </g>
      )}
    </g>
  );
}
