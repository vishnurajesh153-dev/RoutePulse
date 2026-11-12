import React from 'react';
import { Check, CloudDrizzle, Wind } from 'lucide-react';

export default function WeatherCard() {
  return (
    <div className="weather-card">
      <div className="weather-top">
        <div>
          <span className="section-kicker">LOCAL CONDITIONS</span>
          <h3>Looking good out there.</h3>
        </div>
        <div className="weather-symbol"><CloudDrizzle size={25} /></div>
      </div>
      <div className="weather-details">
        <div>
          <strong>22°</strong>
          <small>Feels like 23°</small>
        </div>
        <div><Wind size={15} /><span>8 km/h</span></div>
        <div><CloudDrizzle size={15} /><span>10% rain</span></div>
      </div>
      <div className="weather-note">
        <span className="weather-check"><Check size={12} /></span>
        No severe weather alerts for your route
      </div>
    </div>
  );
}
