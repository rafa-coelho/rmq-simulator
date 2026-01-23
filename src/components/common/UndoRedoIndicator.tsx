import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Undo2, Redo2 } from 'lucide-react';
import { useSimulatorStore } from '../../store/simulatorStore';

export function UndoRedoIndicator() {
  const { t } = useTranslation();
  const { historyIndex } = useSimulatorStore();
  const [lastAction, setLastAction] = useState<'undo' | 'redo' | null>(null);
  const [prevHistoryIndex, setPrevHistoryIndex] = useState(historyIndex);

  useEffect(() => {
    if (historyIndex < prevHistoryIndex) {
      setLastAction('undo');
      const timer = setTimeout(() => setLastAction(null), 1500);
      return () => clearTimeout(timer);
    } else if (historyIndex > prevHistoryIndex) {
      setLastAction('redo');
      const timer = setTimeout(() => setLastAction(null), 1500);
      return () => clearTimeout(timer);
    }
    setPrevHistoryIndex(historyIndex);
  }, [historyIndex, prevHistoryIndex]);

  // Don't show anything if there's no action
  if (!lastAction) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
      <div className="bg-rmq-dark/95 backdrop-blur-sm border border-rmq-light rounded-lg shadow-xl px-4 py-2 flex items-center gap-2">
        {lastAction === 'undo' ? (
          <>
            <Undo2 size={16} className="text-rmq-accent" />
            <span className="text-white text-sm font-medium">
              {t('actions.undone') || 'Undone'}
            </span>
          </>
        ) : (
          <>
            <Redo2 size={16} className="text-rmq-success" />
            <span className="text-white text-sm font-medium">
              {t('actions.redone') || 'Redone'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
