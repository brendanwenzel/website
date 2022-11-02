import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Blockchain Tools and Dapps',
    Svg: require('@site/static/img/flask.svg').default,
    description: (
      <>
        Using node.js or Rust to create dapps and tools that
        interact with blockchains.
      </>
    ),
  },
  {
    title: 'Smart Contract Development',
    Svg: require('@site/static/img/box.svg').default,
    description: (
      <>
        Clean and effecient smart contracts written in Solidity
        for token launches, NFTs, staking and more.
      </>
    ),
  },
  {
    title: 'Marketing Strategy',
    Svg: require('@site/static/img/marketing.svg').default,
    description: (
      <>
        Strategies that focus on profitablity as the core metric.
        The idea is to create cashflow for the chance to scale.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>Degen Developer</h3>
        <p>Creating tools and building projects for crypto degens.</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
