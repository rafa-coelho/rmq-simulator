import type { TravelingMessage, SimulatorNode } from '../../types';

interface TravelingMessageProps {
  traveling: TravelingMessage;
  nodes: SimulatorNode[];
}

export function TravelingMessageComponent({ traveling, nodes }: TravelingMessageProps) {
  const sourceNode = nodes.find(n => n.id === traveling.fromId);
  const targetNode = nodes.find(n => n.id === traveling.toId);

  if (!sourceNode || !targetNode) return null;

  const nodeWidth = 160;
  const nodeHeight = 60;

  const startX = sourceNode.position.x + nodeWidth;
  const startY = sourceNode.position.y + nodeHeight / 2;
  const endX = targetNode.position.x;
  const endY = targetNode.position.y + nodeHeight / 2;

  // Calculate position along the line based on progress
  const progress = traveling.progress / 100;
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  // Determine color based on message status
  const getColor = () => {
    switch (traveling.message.status) {
      case 'sent':
        return '#FF6600';
      case 'routed':
        return '#4fc3f7';
      case 'consumed':
        return '#4caf50';
      default:
        return '#FF6600';
    }
  };

  return (
    <g>
      {/* Glow effect */}
      <circle
        cx={currentX}
        cy={currentY}
        r={12}
        fill={getColor()}
        opacity={0.3}
      />
      {/* Message dot */}
      <circle
        cx={currentX}
        cy={currentY}
        r={6}
        fill={getColor()}
      />
      {/* Inner highlight */}
      <circle
        cx={currentX - 2}
        cy={currentY - 2}
        r={2}
        fill="white"
        opacity={0.6}
      />
    </g>
  );
}
