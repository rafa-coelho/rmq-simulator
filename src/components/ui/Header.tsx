import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rabbit, Github, Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showLanguages, setShowLanguages] = React.useState(false);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLanguages(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-rmq-dark border-b border-rmq-light">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-rmq-orange rounded-xl flex items-center justify-center">
              <Rabbit className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">
                {t('app.title')}
              </h1>
              <p className="text-gray-400 text-xs hidden sm:block">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isActive('/')
                  ? 'bg-rmq-orange text-white'
                  : 'text-gray-400 hover:text-white hover:bg-rmq-light/30'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              {t('nav.simulator')}
            </Link>
            <Link
              to="/learn"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isActive('/learn')
                  ? 'bg-rmq-orange text-white'
                  : 'text-gray-400 hover:text-white hover:bg-rmq-light/30'
              }`}
              aria-current={isActive('/learn') ? 'page' : undefined}
            >
              {t('nav.learn')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-rmq-light/30 rounded-lg transition-colors"
                aria-label="Select language"
                aria-expanded={showLanguages}
                aria-haspopup="listbox"
              >
                <Globe size={18} />
                <span className="text-sm hidden sm:inline">
                  {languages.find(l => l.code === i18n.language)?.label || 'English'}
                </span>
              </button>

              {showLanguages && (
                <div
                  className="absolute top-full right-0 mt-1 bg-rmq-dark border border-rmq-light rounded-lg shadow-xl z-50 overflow-hidden"
                  role="listbox"
                  aria-label="Language options"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-rmq-light/50 transition-colors ${
                        i18n.language === lang.code
                          ? 'text-rmq-orange bg-rmq-orange/10'
                          : 'text-gray-300'
                      }`}
                      role="option"
                      aria-selected={i18n.language === lang.code}
                      lang={lang.code}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/rafa-coelho/rmq-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white hover:bg-rmq-light/30 rounded-lg transition-colors"
              title="View on GitHub"
              aria-label="View source code on GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
