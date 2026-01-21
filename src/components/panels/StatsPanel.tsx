import { useTranslation } from 'react-i18next';
import { BarChart3, Send, GitBranch, CheckCircle, XCircle, Inbox } from 'lucide-react';
import { useSimulatorStore } from '../../store/simulatorStore';

export function StatsPanel() {
  const { t } = useTranslation();
  const { stats } = useSimulatorStore();

  const statItems = [
    {
      label: t('stats.totalSent'),
      value: stats.totalSent,
      icon: <Send size={16} />,
      color: 'text-rmq-orange',
      bgColor: 'bg-rmq-orange/10',
    },
    {
      label: t('stats.totalRouted'),
      value: stats.totalRouted,
      icon: <GitBranch size={16} />,
      color: 'text-rmq-accent',
      bgColor: 'bg-rmq-accent/10',
    },
    {
      label: t('stats.messagesInQueues'),
      value: stats.messagesInQueues,
      icon: <Inbox size={16} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: t('stats.totalConsumed'),
      value: stats.totalConsumed,
      icon: <CheckCircle size={16} />,
      color: 'text-rmq-success',
      bgColor: 'bg-rmq-success/10',
    },
    {
      label: t('stats.totalRejected'),
      value: stats.totalRejected,
      icon: <XCircle size={16} />,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
  ];

  return (
    <div className="bg-rmq-dark/80 backdrop-blur-sm rounded-xl border border-rmq-light p-3">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
        <BarChart3 size={16} />
        {t('stats.title')}
      </h3>

      <div className="grid grid-cols-5 gap-2">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} rounded-lg p-2 text-center`}
          >
            <div className={`${item.color} flex justify-center mb-1`}>
              {item.icon}
            </div>
            <div className={`${item.color} text-xl font-bold`}>
              {item.value}
            </div>
            <div className="text-gray-400 text-xs truncate">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
