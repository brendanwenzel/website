import type { Metadata } from 'next';

import { PageHeader } from '@/components/site/PageHeader';
import { Prose } from '@/components/site/Prose';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for brendanwenzel.com and applications integrating with TikTok Shop, Meta, and Google.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader title="Privacy Policy" lead="Last updated: 04/16/2025" />
      <Prose>
        <h2>Introduction</h2>
        <p>
          This Privacy Policy describes how we collect, use, and handle your personal
          information when you use our website and applications that integrate with various
          platforms including TikTok Shop, Meta (Facebook/Instagram), and Google.
        </p>

        <h2>Information We Collect</h2>
        <h3>Website Usage Data</h3>
        <ul>
          <li>IP addresses</li>
          <li>Browser type and version</li>
          <li>Pages visited</li>
          <li>Time spent on pages</li>
          <li>Referring websites</li>
          <li>Device information</li>
        </ul>
        <h3>Application Data</h3>
        <p>
          When you use our applications that integrate with third-party platforms, we may
          collect:
        </p>
        <h4>TikTok Shop Integration</h4>
        <ul>
          <li>Shop account information</li>
          <li>Product data</li>
          <li>Order information</li>
          <li>Customer interaction data</li>
          <li>Analytics data</li>
        </ul>
        <h4>Meta (Facebook/Instagram) Integration</h4>
        <ul>
          <li>User profile information</li>
          <li>Page insights</li>
          <li>Ad performance data</li>
          <li>Audience demographics</li>
          <li>Engagement metrics</li>
        </ul>
        <h4>Google Integration</h4>
        <ul>
          <li>Search analytics</li>
          <li>Ad performance data</li>
          <li>User behavior metrics</li>
          <li>Conversion tracking</li>
          <li>API usage statistics</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Improve user experience</li>
          <li>Analyze application performance</li>
          <li>Optimize platform integrations</li>
          <li>Send important updates and notifications</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <p>We implement appropriate security measures to protect your personal information:</p>
        <ul>
          <li>Encryption of sensitive data</li>
          <li>Regular security audits</li>
          <li>Access controls</li>
          <li>Secure data transmission</li>
          <li>Regular backups</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>Our applications integrate with the following platforms:</p>
        <h3>TikTok Shop</h3>
        <ul>
          <li>Data is processed according to TikTok Shop&apos;s API terms</li>
          <li>We comply with TikTok Shop&apos;s data protection requirements</li>
          <li>Data is used for shop management and analytics</li>
        </ul>
        <h3>Meta Platforms</h3>
        <ul>
          <li>Data handling follows Meta&apos;s Platform Terms</li>
          <li>We adhere to Meta&apos;s data usage policies</li>
          <li>Information is used for business insights and optimization</li>
        </ul>
        <h3>Google Services</h3>
        <ul>
          <li>Data processing follows Google&apos;s API Terms of Service</li>
          <li>We comply with Google&apos;s data protection requirements</li>
          <li>Information is used for analytics and optimization</li>
        </ul>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to data processing</li>
          <li>Request data portability</li>
          <li>Withdraw consent</li>
        </ul>

        <h2>Data Retention</h2>
        <p>We retain your information for as long as necessary to:</p>
        <ul>
          <li>Provide our services</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
          <li>Enforce our agreements</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>We use cookies and similar tracking technologies to:</p>
        <ul>
          <li>Improve website functionality</li>
          <li>Analyze usage patterns</li>
          <li>Personalize user experience</li>
          <li>Track application performance</li>
        </ul>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our services are not intended for users under 13 years of age. We do not knowingly
          collect personal information from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of any changes by
          posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <ul>
          <li>
            Email: <a href="mailto:contact@brendanwenzel.com">contact@brendanwenzel.com</a>
          </li>
        </ul>
      </Prose>
    </div>
  );
}
