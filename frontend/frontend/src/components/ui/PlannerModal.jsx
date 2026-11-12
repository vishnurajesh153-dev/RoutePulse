import React, { useState } from 'react';
import { MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function PlannerModal({ onClose, onSubmit }) {
  const [destination, setDestination] = useState('Riverside Park');

  const handleSubmit = () => {
    onSubmit?.(destination);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Plan a new route"
    >
      <div className="planner-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <span className="section-kicker">LET'S GET MOVING</span>
            <h2>Plan your next route</h2>
            <p>Tell PACER where your group wants to go.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <label>Destination</label>
        <div className="input-wrap">
          <MapPin size={16} />
          <input
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="Enter a destination"
            autoFocus
          />
        </div>

        <div className="modal-two">
          <div>
            <label>Activity</label>
            <select defaultValue="Cycling">
              <option>Cycling</option>
              <option>Running</option>
              <option>Walking</option>
            </select>
          </div>
          <div>
            <label>Group size</label>
            <select defaultValue="4 members">
              <option>2 members</option>
              <option>3 members</option>
              <option>4 members</option>
              <option>5–10 members</option>
            </select>
          </div>
        </div>

        <div className="modal-note">
          <ShieldCheck size={16} />
          <span>
            PACER will check safety limits, group effort and weather
            before recommending a route.
          </span>
        </div>

        <button className="primary-button modal-submit" onClick={handleSubmit}>
          <Sparkles size={16} /> Generate safe routes
        </button>
        <small className="prototype-note">
          Prototype interface · Route calculation is not connected yet
        </small>
      </div>
    </div>
  );
}
