import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { routes } from '../../data/routes';

export default function InsightPanel({ selectedRoute }) {
  const r = routes[selectedRoute];

  return (
    <div className="panel insight-panel">
      <div className="panel-heading">
        <div>
          <div className="section-kicker">SMART ROUTING</div>
          <h2>Why this route?</h2>
        </div>
        <div className="sparkle-icon"><Sparkles size={16} /></div>
      </div>

      <p className="insight-copy">
        PACER picked <strong>{r.name}</strong> because it balances
        safety, comfort and group effort.
      </p>

      <div className="score-bars">
        <div className="score-row">
          <div><span>Safety confidence</span><strong>{r.confidence}%</strong></div>
          <div className="bar"><i style={{ width: `${r.confidence}%` }} /></div>
        </div>
        <div className="score-row">
          <div><span>Group effort fit</span><strong>88%</strong></div>
          <div className="bar"><i style={{ width: '88%' }} /></div>
        </div>
        <div className="score-row">
          <div><span>Weather suitability</span><strong>96%</strong></div>
          <div className="bar"><i style={{ width: '96%' }} /></div>
        </div>
      </div>

      <div className="insight-foot">
        <Zap size={14} />
        <span>Beginner-friendly · No high-risk segments</span>
      </div>
    </div>
  );
}
