import React from 'react';
import { ArrowRight, Check, Route, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { routes } from '../../data/routes';

export default function RoutePanel({ selectedRoute, setSelectedRoute, onNotify }) {
  return (
    <div className="panel route-panel">
      <div className="panel-heading">
        <div>
          <div className="section-kicker">PACER RECOMMENDATION</div>
          <h2>Suggested routes</h2>
        </div>
        <button className="filter-button" onClick={() => onNotify?.('Route filters are ready for backend integration.')}>
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="route-list">
        {routes.map((r, i) => (
          <button
            key={r.name}
            className={`route-option ${selectedRoute === i ? 'selected' : ''}`}
            onClick={() => setSelectedRoute(i)}
          >
            <div className={`route-thumb ${r.color}`}><Route size={19} /></div>
            <div className="route-main">
              <div className="route-name">
                {r.name}
                {i === 0 && (
                  <span className="recommended-tag">
                    <Sparkles size={10} /> BEST FIT
                  </span>
                )}
              </div>
              <div className="route-meta">
                {r.distance} km <span>·</span> {r.time} <span>·</span> {r.climb} climb
              </div>
            </div>
            <div className="route-risk">
              <span className={r.risk === 'Low' ? 'risk-low' : 'risk-medium'}>{r.risk} risk</span>
              <small>{r.confidence}% confidence</small>
            </div>
            <div className="route-score">
              <strong>{r.score}</strong>
              <small>PACER score</small>
            </div>
            <div className={`radio-mark ${selectedRoute === i ? 'checked' : ''}`}>
              {selectedRoute === i && <Check size={11} />}
            </div>
          </button>
        ))}
      </div>

      <div className="route-footer">
        <span><ShieldCheck size={14} /> Hard safety limits passed</span>
        <button
          className="text-button"
          onClick={() => onNotify?.(`Selected ${routes[selectedRoute].name}.`)}
        >
          View route details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
