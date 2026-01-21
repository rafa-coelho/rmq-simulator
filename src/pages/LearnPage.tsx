import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { LearnSection } from '../components/content/LearnSection';
import { Footer } from '../components/ui/Footer';

export function LearnPage() {
  const { t, i18n } = useTranslation();

  // SEO meta tags based on language
  const seoContent = {
    en: {
      title: 'Learn RabbitMQ - Complete Guide to Message Queuing | RabbitMQ Simulator',
      description: 'Comprehensive guide to RabbitMQ: learn about producers, exchanges, queues, consumers, bindings, and messaging patterns. Free in-depth tutorial with examples.',
      keywords: 'learn RabbitMQ, RabbitMQ tutorial, message queue guide, AMQP tutorial, exchange types, routing patterns, pub/sub, work queues, dead letter exchange'
    },
    pt: {
      title: 'Aprenda RabbitMQ - Guia Completo de Filas de Mensagens | Simulador RabbitMQ',
      description: 'Guia completo de RabbitMQ: aprenda sobre producers, exchanges, filas, consumers, bindings e padrões de mensageria. Tutorial gratuito e aprofundado com exemplos.',
      keywords: 'aprenda RabbitMQ, tutorial RabbitMQ, guia fila de mensagens, tutorial AMQP, tipos de exchange, padrões de roteamento, pub/sub, work queues, dead letter exchange'
    },
    es: {
      title: 'Aprende RabbitMQ - Guía Completa de Colas de Mensajes | Simulador RabbitMQ',
      description: 'Guía completa de RabbitMQ: aprende sobre producers, exchanges, colas, consumers, bindings y patrones de mensajería. Tutorial gratuito y detallado con ejemplos.',
      keywords: 'aprende RabbitMQ, tutorial RabbitMQ, guía cola de mensajes, tutorial AMQP, tipos de exchange, patrones de enrutamiento, pub/sub, work queues, dead letter exchange'
    }
  };

  const currentLang = i18n.language as keyof typeof seoContent;
  const seo = seoContent[currentLang] || seoContent.en;

  // Structured data for the learning page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": t('learn.title'),
    "description": seo.description,
    "provider": {
      "@type": "Organization",
      "name": "RabbitMQ Simulator",
      "url": "https://rmq-simulator.com"
    },
    "courseMode": "online",
    "isAccessibleForFree": true,
    "inLanguage": i18n.language,
    "educationalLevel": "Beginner to Advanced",
    "teaches": [
      "RabbitMQ fundamentals",
      "Message queue concepts",
      "Exchange types (Direct, Fanout, Topic, Headers)",
      "Messaging patterns",
      "Reliability and durability",
      "Best practices"
    ],
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT2H"
    }
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href="https://rmq-simulator.com/learn" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content="https://rmq-simulator.com/learn" />
        <meta property="og:type" content="article" />
        <html lang={i18n.language} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="flex-1">
        <LearnSection />
      </main>
      <Footer />
    </>
  );
}
