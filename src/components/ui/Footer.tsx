import { useTranslation } from 'react-i18next';
import { Heart, Rabbit } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-rmq-dark border-t border-rmq-light py-6">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rmq-orange rounded-lg flex items-center justify-center">
              <Rabbit className="text-white" size={18} />
            </div>
            <span className="text-white font-semibold">{t('app.title')}</span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span>{t('footer.madeWith')}</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            {t('footer.by')}
            <a href="https://racoelho.com.br" target="_blank" rel="noopener noreferrer">
              <span>{t('footer.owner')}</span>
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://www.rabbitmq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rmq-orange transition-colors"
            >
              RabbitMQ Official
            </a>
            <a
              href="https://www.rabbitmq.com/tutorials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rmq-orange transition-colors"
            >
              Tutorials
            </a>
            <span className="text-gray-500">|</span>
            <a
              href="https://github.com/rafa-coelho/rqm-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-rmq-orange transition-colors text-xs"
            >
              {t('footer.openSource')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
