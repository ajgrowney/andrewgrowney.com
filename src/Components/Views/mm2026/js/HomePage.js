import React from 'react';
import { Link } from 'gatsby';
import MM2026Shell from './Shell';
import { useMM2026Data } from '../../../../Data/mm2026/dataClient';

const cards = [
  {
    title: 'Build My Bracket',
    status: 'Phase 1 live',
    path: '/mm/bracket',
    description: 'Use my first 2026 model or your own custom built models to fill out a bracket.'
  },
  {
    title: 'Model Builder',
    status: 'Phase 2 target',
    path: '/mm/model',
    description: 'Build your own custom models that you can use to fill out the 2026 March Madness bracket.'
  },
  {
    title: 'Stat Explorer',
    status: 'Phase 2 live',
    path: '/mm/stats',
    description: 'Compare the 2026 field against historical finish cohorts, recompute year ranges in-browser, and inspect every published explorer feature.'
  },
  {
    title: 'Team Insights',
    status: 'Phase 1 live',
    path: '/mm/team',
    description: 'Explore the live 2026 team pages, resume splits, stat profile, best wins, and bracket context in one place.'
  }
];

const HomePage = () => {
  const { loading, error, modelsManifest, teamIndex } = useMM2026Data();
  const tournamentTeams = teamIndex?.teams?.filter((team) => team.tournament_team).length || 0;

  return (
    <MM2026Shell>
      <section className="mm26-hero mm26-hero--full">
        <div className="mm26-panel mm26-hero-main mm26-hero-main--full">
          <div className="mm26-kicker">March Madness 2026</div>
          <h1>Madness Suite: YDKYK Reprise</h1>
          <p>
            Years ago I go wrote <Link to="/blogs/4/">this blog </Link>. It was written to inspire curiosity in people that like March Madness as much as myself. It was fun to write, is by no means perfect, and is part of my personal learning journey.
            This year's site walks you through going from <a href="https://www.kaggle.com/competitions/march-machine-learning-mania-2026/overview" target="_blank" rel="noreferrer">Kaggle's dataset</a>, which I use to build my model every year, to your own simple classifier that you can use to fill out your own bracket.
          </p>
        </div>
      </section>

      <section className="mm26-grid">
        {cards.map((card) => (
          <article key={card.title} className="mm26-card">
            <div className="mm26-card-top">
              <h3>{card.title}</h3>
              {/* Status is for my tracking status */}
              {/* <span className="mm26-card-status">{card.status}</span> */}
            </div>
            <p>{card.description}</p>
            <Link className="mm26-button-secondary" to={card.path}>Open page</Link>
          </article>
        ))}
      </section>
    </MM2026Shell>
  );
};

export default HomePage;