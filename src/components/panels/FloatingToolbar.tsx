import { useTranslation } from 'react-i18next';
import { Send, ArrowRightLeft, Inbox, User } from 'lucide-react';
import { useAnalytics } from '../../services/analytics';

interface FloatingToolbarProps {
  onAddNode: (type: 'producer' | 'exchange' | 'queue' | 'consumer') => void;
}

export function FloatingToolbar({ onAddNode }: FloatingToolbarProps) {
  const { t } = useTranslation();
  const { trackNodeCreated } = useAnalytics();

  const handleAddNode = (type: 'producer' | 'exchange' | 'queue' | 'consumer') => {
    onAddNode(type);
    trackNodeCreated(type);
  };

  const tools = [
    {
      type: 'producer' as const,
      icon: Send,
      label: t('toolbar.addProducer'),
      color: 'bg-rmq-orange hover:bg-rmq-orange/80',
      shortcut: '1',
    },
    {
      type: 'exchange' as const,
      icon: ArrowRightLeft,
      label: t('toolbar.addExchange'),
      color: 'bg-rmq-accent hover:bg-rmq-accent/80',
      shortcut: '2',
    },
    {
      type: 'queue' as const,
      icon: Inbox,
      label: t('toolbar.addQueue'),
      color: 'bg-purple-600 hover:bg-purple-600/80',
      shortcut: '3',
    },
    {
      type: 'consumer' as const,
      icon: User,
      label: t('toolbar.addConsumer'),
      color: 'bg-rmq-success hover:bg-rmq-success/80',
      shortcut: '4',
    },
  ];

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
      <div className="bg-rmq-dark/90 backdrop-blur-sm border border-rmq-light rounded-xl p-2 flex flex-col gap-2 shadow-xl">
        {tools.map(tool => (
          <div key={tool.type} className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleAddNode(tool.type)}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${tool.color}
                transition-all duration-200
                hover:scale-110
                group relative
              `}
              title={tool.label}
            >
              <tool.icon size={20} className="text-white" />

              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-rmq-dark border border-rmq-light rounded text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {tool.label}
              </span>
            </button>
            {/* Shortcut hint */}
            <span className="text-[10px] text-gray-500 font-mono">{tool.shortcut}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
