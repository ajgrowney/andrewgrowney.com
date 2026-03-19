import React from 'react';
import Nav from '../../../js/Nav';
import '../css/site.css';

const navContent = [
  { type: 'SingleLink', title: 'Overview', pageRef: '/mm' },
  { type: 'SingleLink', title: 'Build My Bracket', pageRef: '/mm/bracket' },
  { type: 'SingleLink', title: 'Stat Explorer', pageRef: '/mm/stats' },
  { type: 'SingleLink', title: 'Model Builder', pageRef: '/mm/model' },
  { type: 'SingleLink', title: 'Team Insights', pageRef: '/mm/team' }
];

const MM2026Shell = ({ children }) => (
  <div className="mm26-page">
    <Nav page="MM2026" navContent={navContent} />
    <main className="mm26-shell">{children}</main>
  </div>
);

export default MM2026Shell;