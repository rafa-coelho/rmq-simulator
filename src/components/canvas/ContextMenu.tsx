import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Copy, Settings } from 'lucide-react';
import { useSimulatorStore } from '../../store/simulatorStore';
import type { Position } from '../../types';

interface ContextMenuProps {
  position: Position;
  nodeId: string;
  onClose: () => void;
}

export function ContextMenu({ position, nodeId, onClose }: ContextMenuProps) {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteNode, duplicateNode, selectNode } = useSimulatorStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Use setTimeout to allow click events on menu items to fire first
      setTimeout(() => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          onClose();
        }
      }, 0);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Use click instead of mousedown to avoid closing before button click
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleDelete = () => {
    deleteNode(nodeId);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateNode(nodeId);
    onClose();
  };

  const handleEdit = () => {
    selectNode(nodeId);
    onClose();
  };

  return createPortal(
    <div
      ref={menuRef}
      className="fixed bg-rmq-dark border border-rmq-light rounded-lg shadow-xl py-1 min-w-[160px]"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleEdit}
        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-rmq-light/50 flex items-center gap-2"
      >
        <Settings size={14} />
        {t('contextMenu.edit', 'Edit')}
      </button>
      <button
        onClick={handleDuplicate}
        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-rmq-light/50 flex items-center gap-2"
      >
        <Copy size={14} />
        {t('contextMenu.duplicate', 'Duplicate')}
      </button>
      <div className="border-t border-rmq-light my-1" />
      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"
      >
        <Trash2 size={14} />
        {t('contextMenu.delete', 'Delete')}
      </button>
    </div>,
    document.body
  );
}
