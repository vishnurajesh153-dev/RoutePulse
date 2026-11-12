import React from 'react';
import { Activity, ArrowRight, Check } from 'lucide-react';

const STEPS = ['PLAN', 'ADAPT', 'MONITOR', 'EVALUATE', 'REROUTE'];

export default function PacerStrip({ onNotify }) {
  return (
    <section className="pacer-strip">
      <div className="pacer-intro">
        <div className="pacer-symbol"><Activity size={19} /></div>
        <div>
          <strong>Powered by PACER</strong>
          <small>Plan · Adapt · Continuously Monitor · Evaluate · Reroute</small>
        </div>
      </div>

      <div className="pacer-steps">
        {STEPS.map((s, i) => (
          <div className="pacer-step" key={s}>
            <span className={i < 2 ? 'step-done' : ''}>
              {i < 2 ? <Check size={11} /> : i + 1}
            </span>
            <small>{s}</small>
          </div>
        ))}
      </div>

      <button
        className="pacer-link"
        onClick={() => onNotify?.('PACER decision log will be available when the engine is connected.')}
      >
        View decision log <ArrowRight size={13} />
      </button>
    </section>
  );
}
