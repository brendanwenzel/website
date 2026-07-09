import type { Metadata } from 'next';

import { PageHeader } from '@/components/site/PageHeader';
import { Prose } from '@/components/site/Prose';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for brendanwenzel.com and associated services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <PageHeader title="Terms of Service" lead="Last updated: 04/16/2025" />
      <Prose>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website and our services, you accept and agree to be bound
          by the terms and provision of this agreement. If you do not agree to abide by the
          above, please do not use this service.
        </p>

        <h2>2. Description of Service</h2>
        <p>We provide various services including but not limited to:</p>
        <ul>
          <li>Website development and maintenance</li>
          <li>Application development</li>
          <li>Platform integrations (TikTok Shop, Meta, Google)</li>
          <li>Digital marketing services</li>
          <li>Analytics and reporting</li>
        </ul>

        <h2>3. User Obligations</h2>
        <p>As a user of our services, you agree to:</p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account</li>
          <li>Not use our services for any illegal purposes</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Respect intellectual property rights</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our services are owned by us and are
          protected by international copyright, trademark, patent, trade secret, and other
          intellectual property laws.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          We shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages resulting from:
        </p>
        <ul>
          <li>Your use or inability to use our services</li>
          <li>Any unauthorized access to or use of our servers</li>
          <li>Any interruption or cessation of transmission to or from our services</li>
          <li>Any bugs, viruses, or other harmful code that may be transmitted</li>
        </ul>

        <h2>6. Third-Party Services</h2>
        <p>
          Our services may contain links to third-party websites or services that are not owned
          or controlled by us. We have no control over, and assume no responsibility for, the
          content, privacy policies, or practices of any third-party websites or services.
        </p>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your access to our services immediately, without prior
          notice or liability, for any reason whatsoever, including without limitation if you
          breach the Terms.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. We will provide
          notice of any changes by posting the new Terms on this page and updating the
          &quot;Last updated&quot; date.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of [Your
          Jurisdiction], without regard to its conflict of law provisions.
        </p>

        <h2>10. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <ul>
          <li>
            Email: <a href="mailto:contact@brendanwenzel.com">contact@brendanwenzel.com</a>
          </li>
        </ul>
      </Prose>
    </div>
  );
}
