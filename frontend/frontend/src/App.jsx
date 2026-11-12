import React, { useState } from 'react';
import { API } from './config/api.js';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bike,
  CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, CloudDrizzle,
  Compass, Gauge, HeartPulse, Home, Layers, Map, MapPin, Menu, MessageSquare,
  Navigation, Plus, Route, Settings, ShieldCheck, SlidersHorizontal, Sparkles,
  Timer, Users, Wind, Zap, Bell, Search, X, MoreHorizontal
} from 'lucide-react';

const members = [
  { name: 'Alex Morgan', role: 'Ride leader', initials: 'AM', color: 'mint', speed: '22.4', status: 'On route', load: '0.82' },
  { name: 'Jamie Chen', role: 'Experienced', initials: 'JC', color: 'violet', speed: '20.8', status: 'On route', load: '0.91' },
  { name: 'Sam Rivera', role: 'Intermediate', initials: 'SR', color: 'orange', speed: '18.6', status: 'On route', load: '1.04' },
  { name: 'Taylor Brooks', role: 'Beginner', initials: 'TB', color: 'blue', speed: '16.2', status: 'Catching up', load: '1.12' }
];

const demoRoutes = [
  { name: 'Riverside Greenway', type: 'Recommended', distance: '18.4', time: '54 min', climb: '86 m', risk: 'Low', confidence: 92, score: '24.8', color: 'mint' },
  { name: 'Lakeside Loop', type: 'Alternative', distance: '20.1', time: '61 min', climb: '112 m', risk: 'Low', confidence: 86, score: '27.3', color: 'blue' },
  { name: 'Old Town Express', type: 'Fastest', distance: '15.8', time: '43 min', climb: '64 m', risk: 'Moderate', confidence: 68, score: '31.6', color: 'orange' }
];

function Avatar({ person, small=false }) {
  return <div className={`avatar ${person.color} ${small ? 'small' : ''}`}>{person.initials}</div>;
}

function MapCanvas() {
  return <div className="map-canvas">
    <div className="map-grid"></div>
    <svg className="map-art" viewBox="0 0 760 470" preserveAspectRatio="xMidYMid slice" aria-label="Illustrative route map">
      <g className="water">
        <path d="M-30 95 C90 35 155 110 230 80 S360 25 445 78 S585 130 790 42 L790 0 L-30 0Z"/>
        <path d="M-30 390 C90 335 140 410 245 365 S410 330 505 385 S665 420 790 350 L790 500 L-30 500Z"/>
      </g>
      <g className="parks">
        <path d="M70 155 L210 125 L255 190 L225 280 L95 300 L35 235Z"/>
        <path d="M505 120 L665 95 L720 175 L685 275 L555 260 L485 205Z"/>
        <path d="M300 300 L420 270 L475 330 L440 405 L315 420 L270 355Z"/>
      </g>
      <g className="roads">
        <path d="M-20 335 L130 250 L245 280 L355 190 L500 210 L780 90"/>
        <path d="M30 40 L155 145 L275 150 L380 255 L520 300 L735 440"/>
        <path d="M80 450 L190 365 L265 340 L355 190 L430 90 L560 25"/>
        <path d="M0 180 L130 210 L240 190 L355 190 L480 130 L690 160"/>
        <path d="M150 -20 L210 100 L245 190 L225 300 L300 470"/>
        <path d="M590 -20 L550 95 L520 210 L560 300 L520 490"/>
        <path d="M-20 90 L120 120 L245 190 L355 190 L485 205 L780 280"/>
        <path d="M-20 410 L150 365 L265 340 L430 330 L610 350 L780 400"/>
      </g>
      <g className="minor-roads">
        <path d="M40 300 L150 250 L200 170 L300 110 L420 120 L530 80"/>
        <path d="M260 0 L300 100 L355 190 L440 260 L470 470"/>
        <path d="M0 260 L130 310 L225 300 L330 340 L470 330 L620 260 L760 240"/>
        <path d="M380 0 L390 100 L355 190 L290 260 L190 365 L170 470"/>
        <path d="M680 0 L640 110 L620 210 L680 320 L720 470"/>
      </g>
      <path className="route-shadow" d="M105 340 C150 305 178 285 215 267 S300 220 355 190 S430 165 480 175 S560 220 610 185 S670 155 700 135"/>
      <path className="route-line" d="M105 340 C150 305 178 285 215 267 S300 220 355 190 S430 165 480 175 S560 220 610 185 S670 155 700 135"/>
      <g className="map-pin start"><circle cx="105" cy="340" r="15"/><circle cx="105" cy="340" r="5"/></g>
      <g className="map-pin end"><circle cx="700" cy="135" r="15"/><path d="M695 135 L699 139 L706 130"/></g>
      <g className="rider-dot"><circle cx="355" cy="190" r="12"/><circle cx="355" cy="190" r="4"/></g>
      <g className="rider-dot second"><circle cx="480" cy="175" r="10"/><circle cx="480" cy="175" r="3"/></g>
    </svg>
    <div className="map-label label-start"><span className="pin-mini"></span> Start point</div>
    <div className="map-label label-end"><span className="pin-mini end-mini"></span> Destination</div>
    <div className="map-location"><MapPin size={13}/> Riverside Park</div>
    <div className="map-controls"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button><button aria-label="Layers"><Layers size={15}/></button></div>
    <div className="map-legend"><span><i className="legend-route"></i> Recommended route</span><span><i className="legend-rider"></i> Group members</span></div>
    <div className="map-scale">Illustrative map · Live map integration planned</div>
  </div>;
}

function App() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [routes, setRoutes] = useState(demoRoutes);
  const [origin, setOrigin] = useState('A');
  const [destination, setDestination] = useState('I');
  const [groupSize, setGroupSize] = useState('2');
  const [activity, setActivity] = useState('Cycling');
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [hasLiveRouteResults, setHasLiveRouteResults] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [notice, setNotice] = useState('');
  const [tripStarted, setTripStarted] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [trackingScenario, setTrackingScenario] = useState('together');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingEvaluation, setTrackingEvaluation] = useState(null);
  const [trackingError, setTrackingError] = useState('');


  const navItems = [
    { label: 'Overview', icon: Home },
    { label: 'Plan a route', icon: Compass },
    { label: 'Live tracking', icon: Navigation },
    { label: 'Safety reports', icon: ShieldCheck },
    { label: 'Trip history', icon: CalendarDays }
  ];

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  };

  const handleMonitorGroup = async () => {
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingEvaluation(null);

    const positions = [
      {
        member_id: 'member-1',
        latitude: 12.9716,
        longitude: 77.5946,
        seconds_since_update: 2,
      },
      {
        member_id: 'member-2',
        latitude: trackingScenario === 'separated' ? 12.9696 : 12.97168,
        longitude: 77.5946,
        seconds_since_update: 2,
      },
      {
        member_id: 'member-3',
        latitude: 12.97154,
        longitude: 77.59452,
        seconds_since_update: trackingScenario === 'gps_lost' ? 45 : 2,
      },
      {
        member_id: 'member-4',
        latitude: 12.97166,
        longitude: 77.59458,
        seconds_since_update: 2,
      },
    ];

    const payload = {
      group_id: 'routepulse-frontend-live-demo',
      leader_id: 'member-1',
      positions,
    };

    try {
      const monitorResponse = await fetch(API.monitoring.monitor, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const monitorData = await monitorResponse.json();
      if (!monitorResponse.ok) {
        const detail = typeof monitorData.detail === 'string'
          ? monitorData.detail
          : JSON.stringify(monitorData.detail || monitorData);
        throw new Error(detail || 'Monitoring request failed.');
      }

      setTrackingResult(monitorData);

      const evaluationResponse = await fetch(API.monitoring.evaluate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monitorData),
      });
      const evaluationData = await evaluationResponse.json();
      if (!evaluationResponse.ok) {
        const detail = typeof evaluationData.detail === 'string'
          ? evaluationData.detail
          : JSON.stringify(evaluationData.detail || evaluationData);
        throw new Error(detail || 'Safety evaluation failed.');
      }
      setTrackingEvaluation(evaluationData);
    } catch (error) {
      setTrackingError(error.message || 'Unable to connect to the RoutePulse backend.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleGenerateRoutes = async () => {
    if (!origin || !destination || origin === destination) {
      setRouteError('Choose different starting and destination nodes.');
      return;
    }

    setLoadingRoutes(true);
    setRouteError('');

    const memberTemplates = [
      { speed_kmh: 5.0, effort_capacity: 3.0 },
      { speed_kmh: 4.5, effort_capacity: 1.9 },
      { speed_kmh: 5.2, effort_capacity: 2.8 },
      { speed_kmh: 4.8, effort_capacity: 2.5 },
      { speed_kmh: 4.6, effort_capacity: 2.5 },
      { speed_kmh: 5.1, effort_capacity: 2.7 },
      { speed_kmh: 4.7, effort_capacity: 2.4 },
      { speed_kmh: 5.0, effort_capacity: 2.6 },
      { speed_kmh: 4.9, effort_capacity: 2.5 },
      { speed_kmh: 4.8, effort_capacity: 2.5 },
    ];

    const memberCount = Number(groupSize);
    const payload = {
      origin,
      destination,
      group: {
        group_id: 'routepulse-frontend-demo',
        members: memberTemplates.slice(0, memberCount).map((member, index) => ({
          member_id: `member-${index + 1}`,
          ...member,
        })),
      },
      extra_closures: [],
      max_candidates: 5,
    };

    try {
      const response = await fetch(API.routes.adapt, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail || data);
        throw new Error(detail || `Request failed (${response.status})`);
      }
      if (data.status !== 'ok' || !Array.isArray(data.scored_routes) || data.scored_routes.length === 0) {
        throw new Error(data.message || 'PACER could not find a feasible route for this group. Try another destination or group size.');
      }

      const mappedRoutes = data.scored_routes.map((route, index) => ({
        name: `${route.nodes.join(' → ')}`,
        type: index === 0 ? 'Recommended' : 'Alternative',
        distance: (route.distance_m / 1000).toFixed(2),
        time: `${Math.round(route.travel_time_s / 60)} min`,
        climb: 'Not available',
        risk: route.risk < 30 ? 'Low' : route.risk < 60 ? 'Moderate' : 'High',
        confidence: Math.round((1 - route.unverified) * 100),
        score: Number(route.score).toFixed(4),
        color: ['mint', 'blue', 'orange'][index % 3],
        routeId: route.route_id,
        nodes: route.nodes,
        raw: route,
      }));

      setRoutes(mappedRoutes);
      setSelectedRoute(0);
      setHasLiveRouteResults(true);
      setShowPlanner(false);
      setActiveNav('Overview');
      notify(`PACER selected ${mappedRoutes[0].nodes.join(' → ')} for your ${activity.toLowerCase()} group.`);
    } catch (error) {
      setRouteError(error.message || 'Unable to connect to the RoutePulse backend.');
    } finally {
      setLoadingRoutes(false);
    }
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Activity size={22} strokeWidth={2.8}/></div>
        <div><div className="brand-name">route<span>pulse</span></div><div className="brand-tag">GROUP NAVIGATION</div></div>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-switch"><div className="workspace-icon">S</div><div><strong>Sunday Riders</strong><small>Group workspace</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">MENU</div>
      <nav className="nav-list">
        {navItems.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${activeNav===label?'active':''}`} onClick={() => {
          setActiveNav(label);
          if (label === 'Plan a route') setShowPlanner(true);
          else if (label !== 'Overview' && label !== 'Live tracking') {
            notify(`${label} view is part of the frontend prototype.`);
          }
        }}>
          <Icon size={18}/><span>{label}</span>{label==='Live tracking' && <i className="nav-live"/>}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Learn how RoutePulse keeps your group moving safely.</p><button onClick={() => notify('Help centre will be connected in a future iteration.')}>Visit help centre <ArrowRight size={13}/></button></div>
        <button className="nav-item settings" onClick={() => notify('Settings panel coming soon.')}><Settings size={18}/><span>Settings</span></button>
        <div className="profile-row"><div className="profile-avatar">AM</div><div><strong>Alex Morgan</strong><small>Ride leader</small></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{activeNav}</strong></div>
        <div className="top-actions"><div className="search-box"><Search size={15}/><span>Search anything</span><kbd>⌘ K</kbd></div><button className="icon-button notification" onClick={() => notify('You’re all caught up!')}><Bell size={18}/><i/></button><div className="top-divider"></div><div className="date-chip"><CalendarDays size={15}/> Tuesday, Nov 11</div></div>
      </header>

      <div className="page-wrap">
        {activeNav === 'Live tracking' ? (
          <section className="tracking-page">
            <div className="welcome-row">
              <div>
                <div className="eyebrow"><span className="eyebrow-dot"></span> PACER CONTINUOUS MONITORING</div>
                <h1>Live group tracking</h1>
                <p className="subheading">Monitor member proximity and evaluate group safety.</p>
              </div>
            </div>

            <div className="panel tracking-panel">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">SIMULATED GPS INPUT</div>
                  <h2>Monitoring controls</h2>
                </div>
                <span className="live-pill"><i/> BACKEND CONNECTED</span>
              </div>
              <label className="tracking-label" htmlFor="tracking-scenario">Choose a test scenario</label>
              <div className="tracking-controls">
                <select
                  id="tracking-scenario"
                  value={trackingScenario}
                  onChange={(event) => setTrackingScenario(event.target.value)}
                >
                  <option value="together">All members together</option>
                  <option value="separated">Member separated from group</option>
                  <option value="gps_lost">Member GPS signal lost</option>
                </select>
                <button
                  className="primary-button"
                  onClick={handleMonitorGroup}
                  disabled={trackingLoading}
                >
                  {trackingLoading ? 'Checking group...' : 'Run PACER monitoring'}
                </button>
              </div>
              <p className="tracking-help">
                This prototype sends simulated GPS coordinates to the FastAPI backend.
                Separation detection requires three consecutive monitoring updates.
              </p>
              {trackingError && <div className="modal-error" role="alert">{trackingError}</div>}
            </div>

            {!trackingResult ? (
              <div className="panel tracking-empty-state">
                <div className="tracking-empty-icon"><Navigation size={23}/></div>
                <h2>Waiting for monitoring data</h2>
                <p>Choose a scenario and run PACER monitoring to view member positions and safety status.</p>
              </div>
            ) : (
              <>
                <div className="tracking-summary-grid">
                  <div className="stat-card">
                    <div className="stat-top">GROUP STATUS</div>
                    <div className="stat-value tracking-status-value">{trackingResult.overall_status || 'Unknown'}</div>
                    <div className="stat-foot">PACER MONITOR result</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-top">GROUP MEMBERS</div>
                    <div className="stat-value">{trackingResult.member_statuses?.length || 0}</div>
                    <div className="stat-foot">Members checked</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-top">SAFETY ALERTS</div>
                    <div className="stat-value">{trackingResult.alerts?.length || 0}</div>
                    <div className="stat-foot">Alerts generated by monitoring</div>
                  </div>
                </div>

                <div className="panel tracking-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">MEMBER PROXIMITY</div>
                      <h2>Group member status</h2>
                    </div>
                  </div>
                  <div className="tracking-member-list">
                    {(trackingResult.member_statuses || []).map((member) => (
                      <div className="tracking-member-row" key={member.member_id}>
                        <div className="tracking-member-avatar">
                          {member.member_id.replace('member-', 'M')}
                        </div>
                        <div className="tracking-member-info">
                          <strong>{member.member_id}</strong>
                          <small>Distance from group leader</small>
                        </div>
                        <span className="tracking-distance">
                          {Number(member.distance_from_leader_m || 0).toFixed(1)} m
                        </span>
                        <span className={`tracking-status status-${member.status}`}>
                          {String(member.status || 'unknown').replaceAll('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {trackingResult.alerts?.length > 0 && (
                  <div className="panel tracking-panel">
                    <div className="panel-heading">
                      <div>
                        <div className="section-kicker">MONITORING ALERTS</div>
                        <h2>Attention required</h2>
                      </div>
                    </div>
                    <ul className="tracking-alert-list">
                      {trackingResult.alerts.map((alert, index) => (
                        <li key={index}>
                          <AlertTriangle size={15}/>
                          {typeof alert === 'string' ? alert : JSON.stringify(alert)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trackingEvaluation && (
                  <div className="panel tracking-panel">
                    <div className="section-kicker">PACER EVALUATE PHASE</div>
                    <h2>Safety evaluation</h2>
                    <pre style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                      color: '#a8d6c7',
                      fontSize: '10px',
                      lineHeight: 1.6,
                    }}>
                      {JSON.stringify(trackingEvaluation, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
        <section className="welcome-row">
          <div><div className="eyebrow"><span className="eyebrow-dot"></span> YOUR GROUP, IN SYNC</div><h1>Good afternoon, Alex <span className="wave">✳</span></h1><p className="subheading">Ready to make your next move? Here's your group at a glance.</p></div>
          <button className="primary-button" onClick={() => setShowPlanner(true)}><Plus size={17}/> Plan a new route</button>
        </section>

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>GROUP MEMBERS</span><div className="stat-icon mint-bg"><Users size={17}/></div></div><div className="stat-value">04<span className="stat-unit"> / 04</span></div><div className="stat-foot"><span className="status-dot"></span> Everyone checked in</div></div>
          <div className="stat-card"><div className="stat-top"><span>ROUTE DISTANCE</span><div className="stat-icon amber-bg"><Route size={17}/></div></div><div className="stat-value">18.4<span className="stat-unit"> km</span></div><div className="stat-foot"><ArrowDownRight size={14} className="positive"/> 2.6 km shorter than usual</div></div>
          <div className="stat-card"><div className="stat-top"><span>SAFETY CONFIDENCE</span><div className="stat-icon mint-bg"><ShieldCheck size={17}/></div></div><div className="stat-value">92<span className="stat-unit">%</span></div><div className="stat-foot"><span className="confidence-pill">HIGH CONFIDENCE</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>WEATHER CONDITIONS</span><div className="stat-icon amber-bg"><CloudDrizzle size={17}/></div></div><div className="stat-value">22°<span className="stat-unit"> C</span></div><div className="stat-foot"><Wind size={14}/> Light breeze · 8 km/h</div></div>
        </section>

        <section className="content-grid">
          <div className="map-panel panel">
            <div className="panel-heading map-heading"><div><div className="section-kicker">YOUR NEXT ADVENTURE</div><h2>Route overview <span className="live-pill"><i/> READY</span></h2></div><button className="subtle-button" onClick={() => notify('Full-screen map view is coming soon.')}>Explore map <ArrowUpRight size={15}/></button></div>
            <MapCanvas/>
            <div className="map-summary">
              <div className="summary-item"><span className="summary-icon"><Navigation size={15}/></span><div><small>STARTING FROM</small><strong>Central Park Gate</strong></div></div>
              <div className="summary-item"><span className="summary-icon"><MapPin size={15}/></span><div><small>DESTINATION</small><strong>Riverside Park</strong></div></div>
              <div className="summary-item"><span className="summary-icon"><Timer size={15}/></span><div><small>ESTIMATED TIME</small><strong>54 minutes</strong></div></div>
            </div>
          </div>

          <div className="right-column">
            <div className="panel members-panel">
              <div className="panel-heading"><div><div className="section-kicker">THE CREW</div><h2>Group members <span className="count-badge">4</span></h2></div><button className="dots-button" onClick={() => setShowAllMembers(!showAllMembers)}><MoreHorizontal size={19}/></button></div>
              <div className="member-list">{members.slice(0, showAllMembers?4:3).map((m,i)=><div className="member-row" key={m.name}><Avatar person={m}/><div className="member-info"><strong>{m.name}</strong><small>{m.role}</small></div><div className="member-metrics"><strong>{m.speed} <small>km/h</small></strong><span className={i===3?'catching':'online'}>{i===3?'Catching up':'● On route'}</span></div></div>)}</div>
              <button className="text-button full-width" onClick={() => setShowAllMembers(!showAllMembers)}>{showAllMembers?'Show less':'View all members'} <ArrowRight size={14}/></button>
            </div>
            <div className="weather-card">
              <div className="weather-top"><div><span className="section-kicker">LOCAL CONDITIONS</span><h3>Looking good out there.</h3></div><div className="weather-symbol"><CloudDrizzle size={25}/></div></div>
              <div className="weather-details"><div><strong>22°</strong><small>Feels like 23°</small></div><div><Wind size={15}/><span>8 km/h</span></div><div><CloudDrizzle size={15}/><span>10% rain</span></div></div>
              <div className="weather-note"><span className="weather-check"><Check size={12}/></span> No severe weather alerts for your route</div>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel route-panel">
            <div className="panel-heading"><div><div className="section-kicker">PACER RECOMMENDATION</div><h2>Suggested routes</h2></div><button className="filter-button" onClick={() => notify('Route filters are ready for backend integration.')}><SlidersHorizontal size={15}/> Filters</button></div>
            <div className="route-list">{routes.map((r,i)=><button key={r.name} onClick={()=>setSelectedRoute(i)} className={`route-option ${selectedRoute===i?'selected':''}`}>
              <div className={`route-thumb ${r.color}`}><Route size={19}/></div>
              <div className="route-main"><div className="route-name">{r.name} {i===0&&<span className="recommended-tag"><Sparkles size={10}/> BEST FIT</span>}</div><div className="route-meta">{r.distance} km <span>·</span> {r.time} <span>·</span> {r.climb === 'Not available' ? 'elevation unavailable' : `${r.climb} climb`}</div></div>
              <div className="route-risk"><span className={r.risk==='Low'?'risk-low':'risk-medium'}>{r.risk} risk</span><small>{r.confidence}% confidence</small></div>
              <div className="route-score"><strong>{r.score}</strong><small>PACER score</small></div>
              <div className={`radio-mark ${selectedRoute===i?'checked':''}`}>{selectedRoute===i&&<Check size={11}/>}</div>
            </button>)}</div>
            <div className="route-footer"><span><ShieldCheck size={14}/> {hasLiveRouteResults ? 'PACER feasibility checks passed' : 'Demo route data'}</span><button className="text-button" onClick={() => notify(`Selected ${routes[selectedRoute].name}.`)}>View route details <ArrowRight size={14}/></button></div>
          </div>
          <div className="panel insight-panel">
            <div className="panel-heading"><div><div className="section-kicker">SMART ROUTING</div><h2>Why this route?</h2></div><div className="sparkle-icon"><Sparkles size={16}/></div></div>
            <p className="insight-copy">PACER picked <strong>{routes[selectedRoute].name}</strong> because it balances safety, comfort and group effort.</p>
            <div className="score-bars">
              <div className="score-row"><div><span>Safety confidence</span><strong>{routes[selectedRoute].confidence}%</strong></div><div className="bar"><i style={{width:`${routes[selectedRoute].confidence}%`}}/></div></div>
              <div className="score-row"><div><span>Group effort fit</span><strong>88%</strong></div><div className="bar"><i style={{width:'88%'}}/></div></div>
              <div className="score-row"><div><span>Weather suitability</span><strong>96%</strong></div><div className="bar"><i style={{width:'96%'}}/></div></div>
            </div>
            <div className="insight-foot"><Zap size={14}/> <span>Beginner-friendly · No high-risk segments</span></div>
          </div>
        </section>

        <section className="pacer-strip">
          <div className="pacer-intro"><div className="pacer-symbol"><Activity size={19}/></div><div><strong>Powered by PACER</strong><small>Plan · Adapt · Continuously Monitor · Evaluate · Reroute</small></div></div>
          <div className="pacer-steps">{['PLAN','ADAPT','MONITOR','EVALUATE','REROUTE'].map((s,i)=><div className="pacer-step" key={s}><span className={i<2?'step-done':''}>{i<2?<Check size={11}/>:i+1}</span><small>{s}</small></div>)}</div>
          <button className="pacer-link" onClick={() => notify('PACER decision log will be available when the engine is connected.')}>View decision log <ArrowRight size={13}/></button>
        </section>
        <footer className="footer"><span>© 2026 RoutePulse. Move together, arrive safer.</span><span>Designed for every pace <HeartPulse size={13}/></span></footer>
          </>
        )}
      </div>
    </main>

    {showPlanner && <div className="modal-backdrop" onClick={() => !loadingRoutes && setShowPlanner(false)}><div className="planner-modal" onClick={e => e.stopPropagation()}><div className="modal-top"><div><span className="section-kicker">LET'S GET MOVING</span><h2>Plan your next route</h2><p>Choose two points from the simulated RoutePulse network.</p></div><button className="icon-button" onClick={() => !loadingRoutes && setShowPlanner(false)} aria-label="Close planner"><X size={18}/></button></div><label>Starting point</label><div className="input-wrap"><MapPin size={16}/><select value={origin} onChange={e => setOrigin(e.target.value)}><option value="A">Node A</option><option value="B">Node B</option><option value="C">Node C</option><option value="D">Node D</option><option value="E">Node E</option><option value="F">Node F</option><option value="G">Node G</option><option value="H">Node H</option><option value="I">Node I</option><option value="J">Node J</option></select></div><label>Destination</label><div className="input-wrap"><MapPin size={16}/><select value={destination} onChange={e => setDestination(e.target.value)}><option value="A">Node A</option><option value="B">Node B</option><option value="C">Node C</option><option value="D">Node D</option><option value="E">Node E</option><option value="F">Node F</option><option value="G">Node G</option><option value="H">Node H</option><option value="I">Node I</option><option value="J">Node J</option></select></div><div className="modal-two"><div><label>Activity</label><select value={activity} onChange={e => setActivity(e.target.value)}><option>Cycling</option><option>Running</option><option>Walking</option></select></div><div><label>Group size</label><select value={groupSize} onChange={e => setGroupSize(e.target.value)}><option value="2">2 members</option><option value="3">3 members</option><option value="4">4 members</option><option value="5">5 members</option><option value="6">6 members</option><option value="7">7 members</option><option value="8">8 members</option><option value="9">9 members</option><option value="10">10 members</option></select></div></div><div className="modal-note"><ShieldCheck size={16}/><span>PACER will generate and score routes using the backend's simulated road, safety and weather data. Activity is currently a display preference; the backend uses member speed and effort profiles.</span></div>{routeError && <div className="modal-error" role="alert">{routeError}</div>}<button className="primary-button modal-submit" onClick={handleGenerateRoutes} disabled={loadingRoutes}>{loadingRoutes ? <><Activity size={16} className="spin-icon"/> Calculating routes…</> : <><Sparkles size={16}/> Generate safe routes</>}</button><small className="prototype-note">Connected to PACER ADAPT · Simulated network data</small></div></div>}
    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

export default App;