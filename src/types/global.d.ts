// Global type declarations for external scripts

// Google Analytics gtag function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        custom_parameter?: string;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }

  function gtag(
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      custom_parameter?: string;
      [key: string]: any;
    }
  ): void;
}

export {};
