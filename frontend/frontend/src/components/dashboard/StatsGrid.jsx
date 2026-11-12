import React from 'react';
import { ArrowDownRight, CloudDrizzle, Route, ShieldCheck, Users, Wind } from 'lucide-react';

export default function StatsGrid() {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-top">
          <span>GROUP MEMBERS</span>
          <div className="stat-icon mint-bg"><Users size={17} /></div>
        </div>
        <div className="stat-value">04<span className="stat-unit"> / 04</span></div>
        <div className="stat-foot"><span className="status-dot" /> Everyone checked in</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>ROUTE DISTANCE</span>
          <div className="stat-icon amber-bg"><Route size={17} /></div>
        </div>
        <div className="stat-value">18.4<span className="stat-unit"> km</span></div>
        <div className="stat-foot"><ArrowDownRight size={14} className="positive" /> 2.6 km shorter than usual</div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>SAFETY CONFIDENCE</span>
          <div className="stat-icon mint-bg"><ShieldCheck size={17} /></div>
        </div>
        <div className="stat-value">92<span className="stat-unit"> %</span></div>
        <div className="stat-foot"><span className="confidence-pill">HIGH CONFIDENCE</span></div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>WEATHER CONDITIONS</span>
          <div className="stat-icon amber-bg"><CloudDrizzle size={17} /></div>
        </div>
        <div className="stat-value">22°<span className="stat-unit"> C</span></div>
        <div className="stat-foot"><Wind size={14} /> Light breeze · 8 km/h</div>
      </div>
    </section>
  );
}
