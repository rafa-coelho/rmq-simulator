import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfigBadgeProps {
  label: string;
  color: string;
  titleKey: string;
  descriptionKey: string;
  icon?: string;
}

export function ConfigBadge({ label, color, titleKey, descriptionKey, icon }: ConfigBadgeProps) {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <span
        className={`text-xs px-1.5 py-0.5 rounded cursor-help ${color}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icon && <span className="mr-0.5">{icon}</span>}
        {label}
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-rmq-darker border border-rmq-light rounded-lg shadow-xl p-3 z-50 pointer-events-none">
          <div className="text-white font-semibold text-sm mb-1">
            {t(titleKey)}
          </div>
          <div className="text-gray-300 text-xs">
            {t(descriptionKey)}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-rmq-light" />
          </div>
        </div>
      )}
    </div>
  );
}
