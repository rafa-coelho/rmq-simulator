import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Send,
  ArrowRightLeft,
  Inbox,
  User,
  Link,
  Shield,
  Lightbulb,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { useAnalytics } from '../../services/analytics';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Section {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  subsections?: { id: string; titleKey: string }[];
}

const sections: Section[] = [
  {
    id: 'introduction',
    titleKey: 'learn.sections.introduction.title',
    icon: <BookOpen size={18} />,
  },
  {
    id: 'concepts',
    titleKey: 'learn.sections.concepts.title',
    icon: <GraduationCap size={18} />,
    subsections: [
      { id: 'producer', titleKey: 'learn.sections.concepts.producer.title' },
      { id: 'exchange', titleKey: 'learn.sections.concepts.exchange.title' },
      { id: 'queue', titleKey: 'learn.sections.concepts.queue.title' },
      { id: 'binding', titleKey: 'learn.sections.concepts.binding.title' },
      { id: 'consumer', titleKey: 'learn.sections.concepts.consumer.title' },
    ],
  },
  {
    id: 'exchangeTypes',
    titleKey: 'learn.sections.exchangeTypes.title',
    icon: <ArrowRightLeft size={18} />,
    subsections: [
      { id: 'direct', titleKey: 'learn.sections.exchangeTypes.direct.title' },
      { id: 'fanout', titleKey: 'learn.sections.exchangeTypes.fanout.title' },
      { id: 'topic', titleKey: 'learn.sections.exchangeTypes.topic.title' },
      { id: 'headers', titleKey: 'learn.sections.exchangeTypes.headers.title' },
    ],
  },
  {
    id: 'patterns',
    titleKey: 'learn.sections.patterns.title',
    icon: <Link size={18} />,
    subsections: [
      { id: 'workQueues', titleKey: 'learn.sections.patterns.workQueues.title' },
      { id: 'pubSub', titleKey: 'learn.sections.patterns.pubSub.title' },
      { id: 'routing', titleKey: 'learn.sections.patterns.routing.title' },
      { id: 'rpc', titleKey: 'learn.sections.patterns.rpc.title' },
    ],
  },
  {
    id: 'reliability',
    titleKey: 'learn.sections.reliability.title',
    icon: <Shield size={18} />,
    subsections: [
      { id: 'acks', titleKey: 'learn.sections.reliability.acks.title' },
      { id: 'durability', titleKey: 'learn.sections.reliability.durability.title' },
      { id: 'prefetch', titleKey: 'learn.sections.reliability.prefetch.title' },
    ],
  },
  {
    id: 'bestPractices',
    titleKey: 'learn.sections.bestPractices.title',
    icon: <Lightbulb size={18} />,
  },
  {
    id: 'glossary',
    titleKey: 'learn.glossary.title',
    icon: <BookOpen size={18} />,
  },
];

export function LearnSection() {
  const { t } = useTranslation();
  const { trackLearningSectionViewed } = useAnalytics();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('introduction');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectSection = (sectionId: string, subsectionId?: string) => {
    const fullId = subsectionId ? `${sectionId}.${subsectionId}` : sectionId;
    setActiveSection(fullId);
    trackLearningSectionViewed(fullId);
    // Close mobile sidebar when selecting a section
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const renderContent = () => {
    const [section, subsection] = activeSection.split('.');

    if (section === 'introduction') {
      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('learn.sections.introduction.title')}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('learn.sections.introduction.content')}
          </p>

          <div className="bg-rmq-light/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-semibold text-white mb-4">{t('learn.sections.introduction.whatIs.title')}</h3>
            <p className="text-gray-300">
              {t('learn.sections.introduction.whatIs.content')}
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('learn.sections.introduction.whyUse.title')}</h2>
          <p className="text-gray-300 mb-4">{t('learn.sections.introduction.whyUse.intro')}</p>
          <ul className="space-y-3 text-gray-300">
            {(t('learn.sections.introduction.whyUse.items', { returnObjects: true }) as string[]).slice(0, 4).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-rmq-orange mt-1">•</span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
              </li>
            ))}
          </ul>

          <div className="bg-gradient-to-r from-rmq-orange/20 to-rmq-accent/20 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-2">{t('learn.sections.introduction.gettingStarted.title')}</h3>
            <p className="text-gray-300">
              {t('learn.sections.introduction.gettingStarted.content')}
            </p>
          </div>
        </article>
      );
    }

    if (section === 'concepts' && subsection) {
      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t(`learn.sections.concepts.${subsection}.title`)}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t(`learn.sections.concepts.${subsection}.content`)}
          </p>

          {subsection === 'producer' && (
            <>
              <div className="flex items-center gap-4 my-6 p-4 bg-rmq-orange/10 rounded-xl border border-rmq-orange/30">
                <Send className="text-rmq-orange" size={32} />
                <div>
                  <h4 className="text-white font-semibold">{t('learn.components.producer.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.producer.description')}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('learn.components.producer.characteristicsTitle')}</h3>
              <ul className="space-y-2 text-gray-300">
                {(t('learn.components.producer.characteristics', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </>
          )}

          {subsection === 'exchange' && (
            <>
              <div className="flex items-center gap-4 my-6 p-4 bg-rmq-accent/10 rounded-xl border border-rmq-accent/30">
                <ArrowRightLeft className="text-rmq-accent" size={32} />
                <div>
                  <h4 className="text-white font-semibold">{t('learn.components.exchange.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.exchange.description')}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('learn.components.exchangeTypes.title')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-rmq-darker p-4 rounded-lg border border-rmq-light">
                  <h4 className="text-blue-400 font-semibold">{t('learn.components.exchangeTypes.direct.name')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.exchangeTypes.direct.description')}</p>
                </div>
                <div className="bg-rmq-darker p-4 rounded-lg border border-rmq-light">
                  <h4 className="text-purple-400 font-semibold">{t('learn.components.exchangeTypes.fanout.name')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.exchangeTypes.fanout.description')}</p>
                </div>
                <div className="bg-rmq-darker p-4 rounded-lg border border-rmq-light">
                  <h4 className="text-green-400 font-semibold">{t('learn.components.exchangeTypes.topic.name')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.exchangeTypes.topic.description')}</p>
                </div>
                <div className="bg-rmq-darker p-4 rounded-lg border border-rmq-light">
                  <h4 className="text-orange-400 font-semibold">{t('learn.components.exchangeTypes.headers.name')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.exchangeTypes.headers.description')}</p>
                </div>
              </div>
            </>
          )}

          {subsection === 'queue' && (
            <>
              <div className="flex items-center gap-4 my-6 p-4 bg-rmq-accent/10 rounded-xl border border-rmq-accent/30">
                <Inbox className="text-rmq-accent" size={32} />
                <div>
                  <h4 className="text-white font-semibold">{t('learn.components.queue.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.queue.description')}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('learn.components.queue.title')}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong className="text-white">Durable:</strong> {t('learn.components.queue.properties.durable')}</li>
                <li>• <strong className="text-white">Auto-delete:</strong> {t('learn.components.queue.properties.autoDelete')}</li>
                <li>• <strong className="text-white">Exclusive:</strong> {t('learn.components.queue.properties.exclusive')}</li>
                <li>• <strong className="text-white">TTL:</strong> {t('learn.components.queue.properties.ttl')}</li>
              </ul>
            </>
          )}

          {subsection === 'binding' && (
            <>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('learn.components.binding.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('learn.components.binding.description')}
              </p>

              <div className="bg-rmq-darker p-4 rounded-lg border border-rmq-light font-mono text-sm">
                <span className="text-gray-500"># {t('learn.components.binding.example')}</span><br/>
                <span className="text-rmq-orange">direct_exchange</span> → <span className="text-rmq-accent">queue_1</span> [key: "info"]<br/>
                <span className="text-purple-400">fanout_exchange</span> → <span className="text-rmq-accent">queue_*</span> [no key needed]<br/>
                <span className="text-green-400">topic_exchange</span> → <span className="text-rmq-accent">queue_2</span> [pattern: "*.order.*"]
              </div>
            </>
          )}

          {subsection === 'consumer' && (
            <>
              <div className="flex items-center gap-4 my-6 p-4 bg-rmq-success/10 rounded-xl border border-rmq-success/30">
                <User className="text-rmq-success" size={32} />
                <div>
                  <h4 className="text-white font-semibold">{t('learn.components.consumer.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('learn.components.consumer.description')}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('learn.components.consumer.title')}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong className="text-white">Prefetch:</strong> {t('learn.components.consumer.settings.prefetch')}</li>
                <li>• <strong className="text-white">Auto-ack:</strong> {t('learn.components.consumer.settings.autoAck')}</li>
                <li>• <strong className="text-white">Manual-ack:</strong> {t('learn.components.consumer.settings.manualAck')}</li>
              </ul>
            </>
          )}
        </article>
      );
    }

    if (section === 'exchangeTypes' && subsection) {
      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t(`learn.sections.exchangeTypes.${subsection}.title`)}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t(`learn.sections.exchangeTypes.${subsection}.content`)}
          </p>

          {subsection === 'direct' && (
            <div className="bg-rmq-darker p-6 rounded-xl border border-rmq-light mt-6">
              <h4 className="text-white font-semibold mb-3">{t('learn.components.exchangeTypes.direct.howItWorks')}</h4>
              <div className="font-mono text-sm space-y-2">
                <div className="text-gray-400">{t('learn.components.exchangeTypes.direct.messageWith')}"info"</div>
                <div className="text-blue-400">↓</div>
                <div className="text-blue-400">{t('learn.components.exchangeTypes.direct.exchangeName')}</div>
                <div className="text-blue-400">↓ ({t('learn.components.exchangeTypes.direct.matchesBinding')} "info")</div>
                <div className="text-rmq-accent">{t('learn.components.exchangeTypes.direct.queueBound')}"info"</div>
              </div>
            </div>
          )}

          {subsection === 'fanout' && (
            <div className="bg-rmq-darker p-6 rounded-xl border border-rmq-light mt-6">
              <h4 className="text-white font-semibold mb-3">{t('learn.components.exchangeTypes.fanout.howItWorks')}</h4>
              <div className="font-mono text-sm">
                <div className="text-gray-400">{t('learn.components.exchangeTypes.fanout.anyMessage')}</div>
                <div className="text-purple-400">↓</div>
                <div className="text-purple-400">{t('learn.components.exchangeTypes.fanout.exchangeName')}</div>
                <div className="flex gap-8 mt-2">
                  <div className="text-center">
                    <div className="text-purple-400">↓</div>
                    <div className="text-rmq-accent">{t('learn.components.exchangeTypes.fanout.queue')} 1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400">↓</div>
                    <div className="text-rmq-accent">{t('learn.components.exchangeTypes.fanout.queue')} 2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400">↓</div>
                    <div className="text-rmq-accent">{t('learn.components.exchangeTypes.fanout.queue')} 3</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subsection === 'topic' && (
            <>
              <div className="bg-rmq-darker p-6 rounded-xl border border-rmq-light mt-6">
                <h4 className="text-white font-semibold mb-3">{t('learn.components.exchangeTypes.topic.patternRules')}</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><code className="text-green-400">*</code> - {t('learn.components.exchangeTypes.topic.matchesOneWord')}</li>
                  <li><code className="text-green-400">#</code> - {t('learn.components.exchangeTypes.topic.matchesZeroOrMore')}</li>
                </ul>
              </div>

              <div className="bg-rmq-darker p-6 rounded-xl border border-rmq-light mt-4">
                <h4 className="text-white font-semibold mb-3">{t('learn.components.exchangeTypes.topic.examples')}</h4>
                <div className="font-mono text-sm space-y-2">
                  <div><span className="text-green-400">*.order.*</span> {t('learn.components.exchangeTypes.topic.matches')} <span className="text-gray-400">us.order.created</span></div>
                  <div><span className="text-green-400">us.#</span> {t('learn.components.exchangeTypes.topic.matches')} <span className="text-gray-400">us.order.created.v2</span></div>
                  <div><span className="text-green-400">#.critical</span> {t('learn.components.exchangeTypes.topic.matches')} <span className="text-gray-400">system.alert.critical</span></div>
                </div>
              </div>
            </>
          )}

          {subsection === 'headers' && (
            <div className="bg-rmq-darker p-6 rounded-xl border border-rmq-light mt-6">
              <h4 className="text-white font-semibold mb-3">{t('learn.components.exchangeTypes.headers.matchingTitle')}</h4>
              <p className="text-gray-300 mb-4">
                {t('learn.components.exchangeTypes.headers.matchingDescription')}
              </p>
              <div className="font-mono text-sm">
                <div className="text-gray-400">{t('learn.components.exchangeTypes.headers.messageHeaders')}: {`{ format: "pdf", type: "report" }`}</div>
                <div className="text-orange-400">↓</div>
                <div className="text-orange-400">{t('learn.components.exchangeTypes.headers.exchangeName')}</div>
                <div className="text-orange-400">↓ (x-match: all)</div>
                <div className="text-rmq-accent">{t('learn.components.exchangeTypes.headers.queueBinding')}: {`{ format: "pdf" }`}</div>
              </div>
            </div>
          )}
        </article>
      );
    }

    if (section === 'patterns' && subsection) {
      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t(`learn.sections.patterns.${subsection}.title`)}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t(`learn.sections.patterns.${subsection}.content`)}
          </p>

          <div className="bg-gradient-to-r from-rmq-orange/10 to-rmq-accent/10 rounded-xl p-6 mt-6">
            <h4 className="text-white font-semibold mb-2">{t('learn.components.trySimulatorPrompt.title')}</h4>
            <p className="text-gray-300 text-sm">
              {t('learn.components.trySimulatorPrompt.description', { pattern: subsection })}
            </p>
          </div>
        </article>
      );
    }

    if (section === 'reliability' && subsection) {
      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t(`learn.sections.reliability.${subsection}.title`)}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            {t(`learn.sections.reliability.${subsection}.content`)}
          </p>
        </article>
      );
    }

    if (section === 'bestPractices') {
      const practices = ['naming', 'errorHandling', 'performance', 'security', 'operations'];

      const getDescription = (key: string): string => {
        // Try different possible keys for description
        const possibleKeys = ['intro', 'content', 'backup.content'];
        for (const descKey of possibleKeys) {
          const value = t(`learn.sections.bestPractices.${key}.${descKey}`, { defaultValue: '' });
          if (value && typeof value === 'string' && !value.includes('learn.sections.bestPractices')) {
            return value;
          }
        }
        return '';
      };

      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('learn.sections.bestPractices.title')}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('learn.sections.bestPractices.subtitle')}
          </p>
          <div className="space-y-6 mt-6">
            {practices.map((key) => {
              const title = t(`learn.sections.bestPractices.${key}.title`);
              const description = getDescription(key);

              return (
                <div key={key} className="bg-rmq-darker p-5 rounded-lg border border-rmq-light">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                      {description && <p className="text-gray-300">{description}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      );
    }

    if (section === 'glossary') {
      const glossaryTerms = [
        'amqp', 'broker', 'vhost', 'connection', 'channel', 'exchange', 'queue',
        'binding', 'routingKey', 'bindingKey', 'producer', 'consumer',
        'ack', 'nack', 'reject', 'dlx', 'dlq', 'ttl', 'durable', 'persistent',
        'prefetch', 'publisherConfirm', 'mandatory', 'alternateExchange',
        'lazyQueue', 'quorumQueue', 'stream', 'shovel', 'federation'
      ];

      return (
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('learn.glossary.title')}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('learn.glossary.subtitle')}
          </p>
          <dl className="space-y-4 mt-6">
            {glossaryTerms.map(termKey => (
              <div key={termKey} className="bg-rmq-darker p-4 rounded-lg border border-rmq-light">
                <dt className="text-rmq-orange font-semibold text-lg">
                  {t(`learn.glossary.terms.${termKey}.term`)}
                </dt>
                <dd className="text-gray-300 mt-2">
                  {t(`learn.glossary.terms.${termKey}.definition`)}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      );
    }

    return null;
  };

  // Sidebar content - reused for both mobile and desktop
  const sidebarContent = (
    <ul className="space-y-1">
      {sections.map(section => (
        <li key={section.id}>
          {section.subsections ? (
            <>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-rmq-light/30 rounded-lg transition-colors"
              >
                {section.icon}
                <span className="flex-1 text-sm">{t(section.titleKey)}</span>
                {expandedSections.includes(section.id) ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
              {expandedSections.includes(section.id) && (
                <ul className="ml-6 mt-1 space-y-1">
                  {section.subsections.map(sub => (
                    <li key={sub.id}>
                      <button
                        onClick={() => selectSection(section.id, sub.id)}
                        className={`w-full px-3 py-1.5 text-left text-sm rounded-lg transition-colors ${
                          activeSection === `${section.id}.${sub.id}`
                            ? 'bg-rmq-orange/20 text-rmq-orange'
                            : 'text-gray-400 hover:text-white hover:bg-rmq-light/30'
                        }`}
                      >
                        {t(sub.titleKey)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <button
              onClick={() => selectSection(section.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-rmq-orange/20 text-rmq-orange'
                  : 'text-gray-300 hover:text-white hover:bg-rmq-light/30'
              }`}
            >
              {section.icon}
              <span className="text-sm">{t(section.titleKey)}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  // Get current section title for mobile header
  const getCurrentSectionTitle = () => {
    const [section, subsection] = activeSection.split('.');
    if (subsection) {
      const sectionObj = sections.find(s => s.id === section);
      const subObj = sectionObj?.subsections?.find(sub => sub.id === subsection);
      return subObj ? t(subObj.titleKey) : t(sectionObj?.titleKey || '');
    }
    const sectionObj = sections.find(s => s.id === section);
    return sectionObj ? t(sectionObj.titleKey) : '';
  };

  return (
    <div className="min-h-screen bg-rmq-darker">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            {t('learn.title')}
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
            {t('learn.subtitle')}
          </p>
        </div>

        {/* Mobile sidebar toggle */}
        {isMobile && (
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="w-full mb-4 flex items-center justify-between px-4 py-3 bg-rmq-dark rounded-xl border border-rmq-light text-white"
          >
            <div className="flex items-center gap-2">
              <Menu size={20} />
              <span className="font-medium">{getCurrentSectionTitle()}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        )}

        {/* Mobile sidebar overlay */}
        {isMobile && showMobileSidebar && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60"
              onClick={() => setShowMobileSidebar(false)}
            />
            {/* Sidebar */}
            <div className="relative w-80 max-w-[85vw] bg-rmq-dark border-r border-rmq-light overflow-y-auto">
              <div className="sticky top-0 bg-rmq-dark border-b border-rmq-light p-4 flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <BookOpen size={18} />
                  {t('learn.toc')}
                </h3>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-rmq-light/30"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                {sidebarContent}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <nav className="w-64 flex-shrink-0">
              <div className="sticky top-4 bg-rmq-dark rounded-xl border border-rmq-light p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BookOpen size={18} />
                  {t('learn.toc')}
                </h3>
                {sidebarContent}
              </div>
            </nav>
          )}

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-rmq-dark rounded-xl border border-rmq-light p-4 md:p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
