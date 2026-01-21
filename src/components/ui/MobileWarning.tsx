import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function MobileWarning() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-rmq-darker p-6">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-rmq-orange"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          {t('mobile.title')}
        </h1>

        {/* Message */}
        <p className="text-gray-300 mb-4">
          {t('mobile.message')}
        </p>

        {/* Suggestion */}
        <p className="text-gray-400 text-sm mb-8">
          {t('mobile.suggestion')}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6" />

        {/* Learn hint */}
        <p className="text-gray-400 text-sm mb-4">
          {t('mobile.learnHint')}
        </p>

        {/* Learn button */}
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 px-6 py-3 bg-rmq-orange hover:bg-rmq-orange/90 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {t('mobile.learnButton')}
        </Link>
      </div>
    </div>
  );
}
