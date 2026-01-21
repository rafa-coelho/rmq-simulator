// Analytics Service
// This service provides a centralized way to track user interactions and events
// Replace the implementation with your preferred analytics provider (Google Analytics, Mixpanel, etc.)

export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsUser {
  id?: string;
  properties?: Record<string, unknown>;
}

class AnalyticsService {
  private initialized = false;
  private debug = import.meta.env.DEV;

  // Initialize analytics with your provider
  init(config?: { trackingId?: string; debug?: boolean }): void {
    if (this.initialized) return;

    this.debug = config?.debug ?? import.meta.env.DEV;

    // Example: Initialize Google Analytics
    // if (config?.trackingId) {
    //   gtag('config', config.trackingId);
    // }

    // Example: Initialize Mixpanel
    // mixpanel.init(config?.trackingId);

    this.initialized = true;
    this.log('Analytics initialized');
  }

  // Track page views
  trackPageView(pageName: string, properties?: Record<string, unknown>): void {
    this.log('Page View', { pageName, ...properties });

    // Example: Google Analytics
    // gtag('event', 'page_view', { page_title: pageName, ...properties });

    // Example: Mixpanel
    // mixpanel.track('Page View', { page: pageName, ...properties });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    this.log('Event', event);

    // Example: Google Analytics
    // gtag('event', event.name, {
    //   event_category: event.category,
    //   ...event.properties,
    // });

    // Example: Mixpanel
    // mixpanel.track(event.name, { category: event.category, ...event.properties });
  }

  // Track simulator-specific events
  trackSimulatorEvent(action: string, properties?: Record<string, unknown>): void {
    this.trackEvent({
      name: action,
      category: 'Simulator',
      properties,
    });
  }

  // Track node creation
  trackNodeCreated(nodeType: string, properties?: Record<string, unknown>): void {
    this.trackSimulatorEvent('node_created', { nodeType, ...properties });
  }

  // Track connection creation
  trackConnectionCreated(sourceType: string, targetType: string): void {
    this.trackSimulatorEvent('connection_created', { sourceType, targetType });
  }

  // Track message sent
  trackMessageSent(exchangeType?: string, hasRoutingKey?: boolean): void {
    this.trackSimulatorEvent('message_sent', { exchangeType, hasRoutingKey });
  }

  // Track example loaded
  trackExampleLoaded(exampleName: string): void {
    this.trackSimulatorEvent('example_loaded', { exampleName });
  }

  // Track learning content viewed
  trackLearningSectionViewed(sectionId: string): void {
    this.trackEvent({
      name: 'learning_section_viewed',
      category: 'Learning',
      properties: { sectionId },
    });
  }

  // Track export/import
  trackExport(): void {
    this.trackSimulatorEvent('diagram_exported');
  }

  trackImport(): void {
    this.trackSimulatorEvent('diagram_imported');
  }

  // Identify user (for authenticated apps)
  identify(user: AnalyticsUser): void {
    this.log('Identify User', user);

    // Example: Mixpanel
    // if (user.id) {
    //   mixpanel.identify(user.id);
    //   if (user.properties) {
    //     mixpanel.people.set(user.properties);
    //   }
    // }
  }

  // Set user properties
  setUserProperties(properties: Record<string, unknown>): void {
    this.log('Set User Properties', properties);

    // Example: Google Analytics
    // gtag('set', 'user_properties', properties);

    // Example: Mixpanel
    // mixpanel.people.set(properties);
  }

  // Track timing events
  trackTiming(category: string, variable: string, value: number): void {
    this.log('Timing', { category, variable, value });

    // Example: Google Analytics
    // gtag('event', 'timing_complete', {
    //   event_category: category,
    //   name: variable,
    //   value,
    // });
  }

  // Track errors
  trackError(error: Error, fatal = false): void {
    this.log('Error', { message: error.message, stack: error.stack, fatal });

    // Example: Google Analytics
    // gtag('event', 'exception', {
    //   description: error.message,
    //   fatal,
    // });
  }

  // Internal logging for debug mode
  private log(type: string, data?: unknown): void {
    if (this.debug) {
      console.log(`[Analytics] ${type}:`, data);
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// React hook for analytics
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackSimulatorEvent: analytics.trackSimulatorEvent.bind(analytics),
    trackNodeCreated: analytics.trackNodeCreated.bind(analytics),
    trackConnectionCreated: analytics.trackConnectionCreated.bind(analytics),
    trackMessageSent: analytics.trackMessageSent.bind(analytics),
    trackExampleLoaded: analytics.trackExampleLoaded.bind(analytics),
    trackLearningSectionViewed: analytics.trackLearningSectionViewed.bind(analytics),
    trackExport: analytics.trackExport.bind(analytics),
    trackImport: analytics.trackImport.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
}
