import React from 'react';
import { MapPin, Layers } from 'lucide-react';

export default function MapCanvas() {
  return (
    <div className="map-canvas">
      <div className="map-grid" />
      <svg
        className="map-art"
        viewBox="0 0 760 470"
        preserveAspectRatio="xMidYMid slice"
        aria-label="Illustrative route map"
      >
        <g className="water">
          <path d="M-30 95 C90 35 155 110 230 80 S360 25 445 78 S585 130 790 42 L790 0 L-30 0Z" />
          <path d="M-30 390 C90 335 140 410 245 365 S410 330 505 385 S665 420 790 350 L790 500 L-30 500Z" />
        </g>
        <g className="parks">
          <path d="M70 155 L210 125 L255 190 L225 280 L95 300 L35 235Z" />
          <path d="M505 120 L665 95 L720 175 L685 275 L555 260 L485 205Z" />
          <path d="M300 300 L420 270 L475 330 L440 405 L315 420 L270 355Z" />
        </g>
        <g className="roads">
          <path d="M-20 335 L130 250 L245 280 L355 190 L500 210 L780 90" />
          <path d="M30 40 L155 145 L275 150 L380 255 L520 300 L735 440" />
          <path d="M80 450 L190 365 L265 340 L355 190 L430 90 L560 25" />
          <path d="M0 180 L130 210 L240 190 L355 190 L480 130 L690 160" />
          <path d="M150 -20 L210 100 L245 190 L225 300 L300 470" />
          <path d="M590 -20 L550 95 L520 210 L560 300 L520 490" />
          <path d="M-20 90 L120 120 L245 190 L355 190 L485 205 L780 280" />
          <path d="M-20 410 L150 365 L265 340 L430 330 L610 350 L780 400" />
        </g>
        <g className="minor-roads">
          <path d="M40 300 L150 250 L200 170 L300 110 L420 120 L530 80" />
          <path d="M260 0 L300 100 L355 190 L440 260 L470 470" />
          <path d="M0 260 L130 310 L225 300 L330 340 L470 330 L620 260 L760 240" />
          <path d="M380 0 L390 100 L355 190 L290 260 L190 365 L170 470" />
          <path d="M680 0 L640 110 L620 210 L680 320 L720 470" />
        </g>
        <path className="route-shadow" d="M105 340 C150 305 178 285 215 267 S300 220 355 190 S430 165 480 175 S560 220 610 185 S670 155 700 135" />
        <path className="route-line"   d="M105 340 C150 305 178 285 215 267 S300 220 355 190 S430 165 480 175 S560 220 610 185 S670 155 700 135" />
        <g className="map-pin start">
          <circle cx="105" cy="340" r="15" />
          <circle cx="105" cy="340" r="5" />
        </g>
        <g className="map-pin end">
          <circle cx="700" cy="135" r="15" />
          <path d="M695 135 L699 139 L706 130" />
        </g>
        <g className="rider-dot">
          <circle cx="355" cy="190" r="12" />
          <circle cx="355" cy="190" r="4" />
        </g>
        <g className="rider-dot second">
          <circle cx="480" cy="175" r="10" />
          <circle cx="480" cy="175" r="3" />
        </g>
      </svg>
      <div className="map-label label-start"><span className="pin-mini" /> Start point</div>
      <div className="map-label label-end"><span className="pin-mini end-mini" /> Destination</div>
      <div className="map-location"><MapPin size={13} /> Riverside Park</div>
      <div className="map-controls">
        <button aria-label="Zoom in">+</button>
        <button aria-label="Zoom out">−</button>
        <button aria-label="Layers"><Layers size={15} /></button>
      </div>
      <div className="map-legend">
        <span><i className="legend-route" /> Recommended route</span>
        <span><i className="legend-rider" /> Group members</span>
      </div>
      <div className="map-scale">Illustrative map · Live map integration planned</div>
    </div>
  );
}
