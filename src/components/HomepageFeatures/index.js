import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Building Defi Bots',
    Svg: require('@site/static/img/flask.svg').default,
    description: (
      <>
        The biggest advantage of DEFI is the ability to automate systems and
        create bots that do services for protocols for rewards.        
      </>
    ),
  },
  {
    title: 'Finding Technical Solutions',
    Svg: require('@site/static/img/box.svg').default,
    description: (
      <>
        The idea is that software should make our lives more effective AND efficient.
        My skill is simplifying and consolidating stacks to work for you.
      </>
    ),
  },
  {
    title: 'Growing Digital Businesses',
    Svg: require('@site/static/img/marketing.svg').default,
    description: (
      <>
        Most of my adult life has been building cashflow on the internet through
        building audiences and profitably using paid advertising.
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
        <h3>{title}</h3>
        <p>{description}</p>
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
