import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null; // Don't run on server-side
  }

  return {
    onRouteUpdate({location}) {
      // This function runs every time the route changes in the browser
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      // Read webhook URL and secret from environment variables
      const webhookUrl = process.env.DOCUSAURUS_WEBHOOK_URL;
      const secret = process.env.DOCUSAURUS_WEBHOOK_SECRET;

      if (code && webhookUrl && secret) {
        const urlWithCode = `${webhookUrl}?code=${encodeURIComponent(code)}`;

        console.log(`Attempting to trigger webhook for code: ${code}`);

        fetch(urlWithCode, {
          method: 'POST', // Using POST for webhook action
          headers: {
            'Secret': secret,
            'Content-Type': 'application/json', // Indicate no body payload if needed
          },
          // body: JSON.stringify({}) // Add body if webhook expects one
        })
        .then(response => {
          if (!response.ok) {
            console.error('Webhook request failed:', response.status, response.statusText);
            response.text().then(text => console.error('Response body:', text)); // Log response body on error
          } else {
            console.log('Webhook triggered successfully for code:', code);
          }
        })
        .catch(error => {
          console.error('Error sending webhook:', error);
        });
      } else if (code && (!webhookUrl || !secret)) {
        console.warn('Webhook URL or Secret environment variable not set. Skipping webhook trigger.');
      }
    },
  };
})(); 