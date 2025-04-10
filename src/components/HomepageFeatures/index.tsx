import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Media Buying & Social Commerce',
    icon: 'fa-solid fa-bullhorn',
    description: (
      <>
        Expert in leveraging platforms like TikTok, Amazon, and YouTube to drive sales. With over 16 years of experience, I've managed millions in ad spend across multiple platforms with proven ROI.
      </>
    ),
  },
  {
    title: 'Technical Marketing & Development',
    icon: 'fa-solid fa-code',
    description: (
      <>
        Skilled in Rust, Solidity, and web development. I bridge the gap between marketing and technology, creating custom solutions that drive results for e-commerce and blockchain projects.
      </>
    ),
  },
  {
    title: 'E-Commerce & Growth Strategy',
    icon: 'fa-solid fa-chart-line',
    description: (
      <>
        Shopify expert with extensive experience in optimizing online stores. I've helped clients elevate monthly revenue from $58k to $256k through strategic digital marketing initiatives.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <i className={`${icon} ${styles.featureIcon}`}></i>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          My Expertise
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
