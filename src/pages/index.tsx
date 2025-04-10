import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.profileContainer}>
          <img 
            src="/img/profile.jpg" 
            alt="Brendan Wenzel" 
            className={styles.profileImage} 
          />
          <div>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/services/marketing-consulting">
                View My Services
              </Link>
              <Link
                className="button button--outline button--lg button--secondary"
                href="https://www.linkedin.com/in/brendanwenzel/"
                target="_blank">
                Connect on LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" className={styles.sectionTitle}>
              About Me
            </Heading>
            <p className={styles.aboutText}>
              I'm a seasoned Digital Marketing professional specializing in Social Commerce, with extensive experience working with platforms like TikTok, Amazon, and YouTube. Based in Newport Beach, California, I help brands leverage social media platforms to drive sales and growth.
            </p>
            <p className={styles.aboutText}>
              My core services include consulting, media buying, technical work (coding/sheets), growth strategies, Shopify optimizations, and creative work. With over 16 years of experience, I've generated millions in revenue for my clients through strategic digital marketing initiatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Brendan Wenzel - Director of Social Commerce | Digital Marketing Expert specializing in TikTok, Amazon, and YouTube">
      <HomepageHeader />
      <main>
        <AboutSection />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
