import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Send,
  ArrowRightLeft,
  Inbox,
  User,
  Trash2,
  Download,
  Upload,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useSimulatorStore } from '../../store/simulatorStore';
import { useAnalytics } from '../../services/analytics';
import { examples, loadExample } from '../../utils/examples';

interface ToolbarProps {
  onAddNode: (type: 'producer' | 'exchange' | 'queue' | 'consumer') => void;
}

export function Toolbar({ onAddNode }: ToolbarProps) {
  const { t } = useTranslation();
  const { clearCanvas, loadDiagram, nodes, connections } = useSimulatorStore();
  const { trackNodeCreated, trackExampleLoaded, trackExport, trackImport } = useAnalytics();
  const [showExamples, setShowExamples] = useState(false);

  const handleAddNode = (type: 'producer' | 'exchange' | 'queue' | 'consumer') => {
    onAddNode(type);
    trackNodeCreated(type);
  };

  const handleExport = () => {
    const data = {
      version: '1.0',
      nodes,
      connections,
      timestamp: Date.now(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rmq-diagram.json';
    a.click();
    URL.revokeObjectURL(url);
    trackExport();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.nodes && data.connections) {
          loadDiagram(data.nodes, data.connections);
          trackImport();
        }
      } catch (err) {
        console.error('Failed to import diagram:', err);
      }
    };
    input.click();
  };

  const handleLoadExample = (exampleId: string) => {
    const result = loadExample(exampleId);
    if (!result) return;

    loadDiagram(result.nodes as any, result.connections as any);
    trackExampleLoaded(exampleId);
    setShowExamples(false);
  };

  return (
    <div className="bg-rmq-dark border-b border-rmq-light px-4 py-2 flex items-center gap-2 flex-wrap">
      {/* Add nodes buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleAddNode('producer')}
          className="btn btn-primary flex items-center gap-2 text-sm"
          title={t('toolbar.addProducer')}
        >
          <Send size={16} />
          <span className="hidden sm:inline">{t('toolbar.addProducer')}</span>
        </button>

        <button
          onClick={() => handleAddNode('exchange')}
          className="btn btn-secondary flex items-center gap-2 text-sm"
          title={t('toolbar.addExchange')}
        >
          <ArrowRightLeft size={16} />
          <span className="hidden sm:inline">{t('toolbar.addExchange')}</span>
        </button>

        <button
          onClick={() => handleAddNode('queue')}
          className="btn btn-secondary flex items-center gap-2 text-sm"
          title={t('toolbar.addQueue')}
        >
          <Inbox size={16} />
          <span className="hidden sm:inline">{t('toolbar.addQueue')}</span>
        </button>

        <button
          onClick={() => handleAddNode('consumer')}
          className="btn btn-success flex items-center gap-2 text-sm"
          title={t('toolbar.addConsumer')}
        >
          <User size={16} />
          <span className="hidden sm:inline">{t('toolbar.addConsumer')}</span>
        </button>
      </div>

      <div className="w-px h-6 bg-rmq-light mx-2" />

      {/* Examples dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="btn btn-secondary flex items-center gap-2 text-sm"
        >
          <BookOpen size={16} />
          <span className="hidden sm:inline">{t('toolbar.examples')}</span>
          <ChevronDown size={14} className={`transition-transform ${showExamples ? 'rotate-180' : ''}`} />
        </button>

        {showExamples && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-rmq-dark border border-rmq-light rounded-lg shadow-xl z-50">
            {examples.map(example => (
              <button
                key={example.id}
                onClick={() => handleLoadExample(example.id)}
                className="w-full px-4 py-3 text-left hover:bg-rmq-light/50 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                <div className="text-white font-medium text-sm">
                  {t(`examples.${example.id}.title`)}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {t(`examples.${example.id}.description`)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleImport}
          className="btn btn-secondary flex items-center gap-2 text-sm"
          title={t('toolbar.import')}
        >
          <Upload size={16} />
          <span className="hidden md:inline">{t('toolbar.import')}</span>
        </button>

        <button
          onClick={handleExport}
          className="btn btn-secondary flex items-center gap-2 text-sm"
          title={t('toolbar.export')}
        >
          <Download size={16} />
          <span className="hidden md:inline">{t('toolbar.export')}</span>
        </button>

        <button
          onClick={clearCanvas}
          className="btn flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/20 border border-red-500/30"
          title={t('toolbar.clear')}
        >
          <Trash2 size={16} />
          <span className="hidden md:inline">{t('toolbar.clear')}</span>
        </button>
      </div>
    </div>
  );
}
