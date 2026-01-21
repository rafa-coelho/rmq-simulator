import { useEffect } from 'react';
import { analytics } from '../services/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  trackingId?: string;
}

export function AnalyticsProvider({ children, trackingId }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize analytics on mount
    analytics.init({ trackingId, debug: import.meta.env.DEV });

    // Track initial page view
    analytics.trackPageView(window.location.pathname);
  }, [trackingId]);

  return <>{children}</>;
}

export function usePageTracking(pageName: string) {
  useEffect(() => {
    analytics.trackPageView(pageName);
  }, [pageName]);
}
