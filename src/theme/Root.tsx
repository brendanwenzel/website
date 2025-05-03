import React, { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

// Default Root component with children
export default function Root({ children }) {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  
  // Get webhook URL and secret from customFields (set in docusaurus.config.ts)
  const webhookUrl = siteConfig.customFields?.webhookUrl as string;
  const webhookSecret = siteConfig.customFields?.webhookSecret as string;

  useEffect(() => {
    // This effect runs on client-side only when route changes
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code && webhookUrl && webhookSecret) {
      const urlWithCode = `${webhookUrl}?code=${encodeURIComponent(code)}`;
      
      console.log(`Attempting to trigger webhook for code: ${code}`);
      
      fetch(urlWithCode, {
        method: 'POST',
        headers: {
          'Secret': webhookSecret,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          console.error('Webhook request failed:', response.status, response.statusText);
          response.text().then(text => console.error('Response body:', text));
        } else {
          console.log('Webhook triggered successfully for code:', code);
        }
      })
      .catch(error => {
        console.error('Error sending webhook:', error);
      });
    } else if (code && (!webhookUrl || !webhookSecret)) {
      console.warn('Webhook URL or Secret not configured. Skipping webhook trigger.');
    }
  }, [location.search, webhookUrl, webhookSecret]); // Re-run when URL params change

  // Render the children without modification
  return <>{children}</>;
} 