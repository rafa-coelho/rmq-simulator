import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react';

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutItem[];
}

export function ShortcutsPanel() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: t('shortcuts.general', 'General'),
      shortcuts: [
        { keys: [`${ctrlKey}+Z`], description: t('shortcuts.undo', 'Undo') },
        { keys: [`${ctrlKey}+Shift+Z`, `${ctrlKey}+Y`], description: t('shortcuts.redo', 'Redo') },
        { keys: [`${ctrlKey}+A`], description: t('shortcuts.selectAll', 'Select all') },
        { keys: [`${ctrlKey}+D`], description: t('shortcuts.duplicate', 'Duplicate') },
        { keys: ['Delete', 'Backspace'], description: t('shortcuts.delete', 'Delete selected') },
        { keys: ['Esc'], description: t('shortcuts.clearSelection', 'Clear selection') },
      ],
    },
    {
      title: t('shortcuts.addNodes', 'Add Nodes'),
      shortcuts: [
        { keys: ['1'], description: t('shortcuts.addProducer', 'Add Producer') },
        { keys: ['2'], description: t('shortcuts.addExchange', 'Add Exchange') },
        { keys: ['3'], description: t('shortcuts.addQueue', 'Add Queue') },
        { keys: ['4'], description: t('shortcuts.addConsumer', 'Add Consumer') },
      ],
    },
    {
      title: t('shortcuts.canvas', 'Canvas'),
      shortcuts: [
        { keys: [t('shortcuts.middleMouse', 'Middle Mouse')], description: t('shortcuts.pan', 'Pan canvas') },
        { keys: [`${ctrlKey}+Scroll`], description: t('shortcuts.zoom', 'Zoom in/out') },
        { keys: [t('shortcuts.clickDrag', 'Click + Drag')], description: t('shortcuts.boxSelect', 'Box select') },
        { keys: [`${ctrlKey}+Click`], description: t('shortcuts.addToSelection', 'Add to selection') },
      ],
    },
  ];

  return (
    <div className="absolute bottom-4 left-20 z-20">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-rmq-dark/90 backdrop-blur-sm border border-rmq-light rounded-lg px-3 py-2 flex items-center gap-2 text-gray-400 hover:text-white hover:border-rmq-accent transition-colors"
      >
        <Keyboard size={16} />
        <span className="text-sm">{t('shortcuts.title', 'Shortcuts')}</span>
        {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {isExpanded && (
        <div className="absolute bottom-full left-0 mb-2 bg-rmq-dark/95 backdrop-blur-sm border border-rmq-light rounded-lg p-4 min-w-[280px] shadow-xl">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Keyboard size={18} />
            {t('shortcuts.keyboardShortcuts', 'Keyboard Shortcuts')}
          </h3>

          <div className="space-y-4">
            {shortcutGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h4 className="text-rmq-accent text-xs font-medium uppercase tracking-wider mb-2">
                  {group.title}
                </h4>
                <div className="space-y-1.5">
                  {group.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center">
                            {keyIndex > 0 && <span className="text-gray-600 mx-1 text-xs">/</span>}
                            <kbd className="bg-rmq-darker px-1.5 py-0.5 rounded text-xs text-gray-300 border border-rmq-light font-mono">
                              {key}
                            </kbd>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
